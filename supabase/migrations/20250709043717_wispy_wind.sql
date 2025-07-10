/*
  # Configuration complète de la base de données IN AUTO

  1. Nouvelles Tables
    - `rendezvous` - Stockage des demandes de rendez-vous
    - `payments` - Enregistrement des paiements Stripe

  2. Sécurité
    - Row Level Security (RLS) activé
    - Politiques pour utilisateurs anonymes et authentifiés

  3. Fonctionnalités
    - Triggers automatiques pour updated_at
    - Index pour optimiser les performances
    - Données de test pour validation
*/

-- Supprimer les tables existantes si elles existent (pour un reset complet)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;

-- Supprimer la fonction si elle existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Créer la table rendezvous
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

-- Créer la table payments
CREATE TABLE payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rendezvous_id uuid REFERENCES rendezvous(id) ON DELETE CASCADE,
    stripe_payment_id text,
    amount integer NOT NULL,
    currency text DEFAULT 'XAF',
    status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    payment_method text CHECK (payment_method IN ('card', 'mobile_money')),
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE rendezvous ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table rendezvous
CREATE POLICY "Anyone can create rendezvous"
    ON rendezvous
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view all rendezvous"
    ON rendezvous
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update rendezvous"
    ON rendezvous
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete rendezvous"
    ON rendezvous
    FOR DELETE
    TO authenticated
    USING (true);

-- Politiques pour la table payments
CREATE POLICY "Anyone can create payments"
    ON payments
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view all payments"
    ON payments
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update payments"
    ON payments
    FOR UPDATE
    TO authenticated
    USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_rendezvous_updated_at
    BEFORE UPDATE ON rendezvous
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index pour optimiser les performances
CREATE INDEX idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX idx_rendezvous_status ON rendezvous(status);
CREATE INDEX idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Insérer des données de test
INSERT INTO rendezvous (nom, telephone, email, service, message, status, payment_status) VALUES
('Test Client 1', '+237123456789', 'test1@example.com', 'diagnostic', 'Test de diagnostic électronique', 'nouveau', 'pending'),
('Marie Dupont', '+237987654321', 'marie.dupont@email.com', 'vidange', 'Vidange complète avec filtres', 'confirme', 'paid'),
('Jean Martin', '+237555123456', NULL, 'climatisation', 'Problème de climatisation - plus de froid', 'nouveau', 'pending'),
('Paul Mballa', '+237666789123', 'paul.mballa@email.com', 'freinage', 'Freins qui grincent', 'en_cours', 'paid'),
('Brigitte Fosso', '+237777456123', 'brigitte@company.com', 'pneus', 'Changement de pneus + géométrie', 'termine', 'paid');

-- Insérer des paiements de test
INSERT INTO payments (rendezvous_id, amount, currency, status, payment_method, metadata) 
SELECT 
    r.id,
    CASE 
        WHEN r.service = 'diagnostic' THEN 15000
        WHEN r.service = 'vidange' THEN 35000
        WHEN r.service = 'climatisation' THEN 25000
        WHEN r.service = 'freinage' THEN 45000
        WHEN r.service = 'pneus' THEN 15000
        ELSE 30000
    END,
    'XAF',
    CASE 
        WHEN r.payment_status = 'paid' THEN 'succeeded'
        ELSE 'pending'
    END,
    'card',
    jsonb_build_object('service_name', r.service, 'customer_name', r.nom)
FROM rendezvous r
WHERE r.payment_status = 'paid';

-- Vérification finale
DO $$
DECLARE
    rendezvous_count integer;
    payments_count integer;
BEGIN
    SELECT COUNT(*) INTO rendezvous_count FROM rendezvous;
    SELECT COUNT(*) INTO payments_count FROM payments;
    
    RAISE NOTICE '✅ Migration terminée avec succès !';
    RAISE NOTICE '📊 Rendez-vous créés: %', rendezvous_count;
    RAISE NOTICE '💳 Paiements créés: %', payments_count;
    RAISE NOTICE '🔒 RLS activé sur toutes les tables';
    RAISE NOTICE '📈 Index créés pour optimiser les performances';
END $$;