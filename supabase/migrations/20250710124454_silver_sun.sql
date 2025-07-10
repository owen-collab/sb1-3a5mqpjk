/*
  # Reset complet et configuration finale de la base de données IN AUTO

  1. Nouvelles Tables
    - `rendezvous` - Stockage des demandes de rendez-vous clients
    - `payments` - Enregistrement des paiements (Stripe + Mobile Money)

  2. Sécurité
    - Row Level Security (RLS) activé
    - Politiques permissives pour le développement

  3. Fonctionnalités
    - Support des paiements mobiles (MTN, Orange)
    - Métadonnées étendues pour les transactions
    - Triggers automatiques pour updated_at
    - Index optimisés pour les performances

  4. Données de test
    - Exemples de rendez-vous avec différents statuts
    - Exemples de paiements mobiles et cartes
*/

-- Supprimer complètement les tables existantes
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Créer la table rendezvous avec structure étendue
CREATE TABLE rendezvous (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom text NOT NULL,
    telephone text NOT NULL,
    email text,
    service text NOT NULL,
    date date,
    heure text,
    message text,
    status text DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'confirme', 'en_cours', 'termine', 'annule')),
    payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Créer la table payments avec support mobile money
CREATE TABLE payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rendezvous_id uuid REFERENCES rendezvous(id) ON DELETE CASCADE,
    stripe_payment_id text, -- Peut contenir ID Stripe ou ID transaction mobile
    amount integer NOT NULL,
    currency text DEFAULT 'XAF',
    status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    payment_method text CHECK (payment_method IN ('card', 'mobile_money')),
    metadata jsonb DEFAULT '{}', -- Stockage des infos spécifiques (provider, phone, etc.)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE rendezvous ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques très permissives pour le développement
CREATE POLICY "Allow all for rendezvous"
    ON rendezvous
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all for payments"
    ON payments
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Fonction pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_rendezvous_updated_at
    BEFORE UPDATE ON rendezvous
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index optimisés
CREATE INDEX idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX idx_rendezvous_status ON rendezvous(status);
CREATE INDEX idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Données de test étendues
INSERT INTO rendezvous (nom, telephone, email, service, message, status, payment_status) VALUES
('Jean Dupont', '+237675123456', 'jean@test.com', 'diagnostic', 'Problème de démarrage', 'nouveau', 'pending'),
('Marie Ngono', '+237698765432', 'marie@test.com', 'vidange', 'Vidange + filtres', 'confirme', 'paid'),
('Paul Mballa', '+237655987654', 'paul@test.com', 'climatisation', 'Clim ne refroidit plus', 'en_cours', 'paid'),
('Sophie Kouam', '+237666123789', 'sophie@test.com', 'freinage', 'Freins qui grincent', 'termine', 'paid'),
('David Fosso', '+237677456123', 'david@test.com', 'pneus', 'Changement 4 pneus', 'nouveau', 'pending'),
('Brigitte Momo', '+237688789456', 'brigitte@test.com', 'revision', 'Révision 20 000 km', 'confirme', 'paid'),
('Michel Biya', '+237699321654', 'michel@test.com', 'reparation', 'Réparation moteur', 'en_cours', 'pending');

-- Paiements de test avec différentes méthodes
INSERT INTO payments (rendezvous_id, amount, currency, status, payment_method, stripe_payment_id, metadata) 
SELECT 
    r.id,
    CASE 
        WHEN r.service = 'diagnostic' THEN 15000
        WHEN r.service = 'vidange' THEN 35000
        WHEN r.service = 'climatisation' THEN 25000
        WHEN r.service = 'freinage' THEN 45000
        WHEN r.service = 'pneus' THEN 15000
        WHEN r.service = 'revision' THEN 75000
        ELSE 30000
    END,
    'XAF',
    CASE 
        WHEN r.payment_status = 'paid' THEN 'succeeded'
        ELSE 'pending'
    END,
    CASE 
        WHEN r.telephone LIKE '%675%' OR r.telephone LIKE '%676%' THEN 'mobile_money'
        WHEN r.telephone LIKE '%698%' OR r.telephone LIKE '%699%' THEN 'mobile_money'
        ELSE 'card'
    END,
    CASE 
        WHEN r.telephone LIKE '%675%' OR r.telephone LIKE '%676%' THEN 'MTN_' || substr(md5(random()::text), 1, 10)
        WHEN r.telephone LIKE '%698%' OR r.telephone LIKE '%699%' THEN 'ORG_' || substr(md5(random()::text), 1, 10)
        ELSE 'pi_' || substr(md5(random()::text), 1, 10)
    END,
    CASE 
        WHEN r.telephone LIKE '%675%' OR r.telephone LIKE '%676%' THEN 
            jsonb_build_object(
                'provider', 'mtn_momo',
                'phone_number', r.telephone,
                'customer_name', r.nom,
                'fees', jsonb_build_object('amount', 250, 'description', 'Frais MTN Mobile Money')
            )
        WHEN r.telephone LIKE '%698%' OR r.telephone LIKE '%699%' THEN 
            jsonb_build_object(
                'provider', 'orange_money',
                'phone_number', r.telephone,
                'customer_name', r.nom,
                'fees', jsonb_build_object('amount', 300, 'description', 'Frais Orange Money')
            )
        ELSE 
            jsonb_build_object(
                'card_type', 'visa',
                'last4', '4242',
                'customer_name', r.nom
            )
    END
FROM rendezvous r
WHERE r.payment_status = 'paid';

-- Vérification finale avec statistiques détaillées
DO $$
DECLARE
    rdv_count integer;
    pay_count integer;
    mobile_payments integer;
    card_payments integer;
BEGIN
    SELECT COUNT(*) INTO rdv_count FROM rendezvous;
    SELECT COUNT(*) INTO pay_count FROM payments;
    SELECT COUNT(*) INTO mobile_payments FROM payments WHERE payment_method = 'mobile_money';
    SELECT COUNT(*) INTO card_payments FROM payments WHERE payment_method = 'card';
    
    RAISE NOTICE '=== MIGRATION COMPLÈTE TERMINÉE ===';
    RAISE NOTICE '📊 Rendez-vous créés: %', rdv_count;
    RAISE NOTICE '💳 Paiements créés: %', pay_count;
    RAISE NOTICE '📱 Paiements mobiles: %', mobile_payments;
    RAISE NOTICE '💳 Paiements cartes: %', card_payments;
    RAISE NOTICE '🔒 RLS activé avec politiques permissives';
    RAISE NOTICE '📈 Index optimisés créés';
    RAISE NOTICE '🚀 Support Mobile Money intégré';
    RAISE NOTICE '================================';
END $$;