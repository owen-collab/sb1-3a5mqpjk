/*
  # Reset complet et configuration de la base de données

  1. Suppression complète des tables existantes
  2. Recréation des tables avec la bonne structure
  3. Configuration RLS et politiques
  4. Insertion de données de test
  5. Vérifications finales
*/

-- Supprimer complètement les tables existantes
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;
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

-- Politiques pour rendezvous (TRÈS PERMISSIVES pour le debug)
CREATE POLICY "Allow all for rendezvous"
    ON rendezvous
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Politiques pour payments (TRÈS PERMISSIVES pour le debug)
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

-- Index
CREATE INDEX idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX idx_rendezvous_status ON rendezvous(status);
CREATE INDEX idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Données de test
INSERT INTO rendezvous (nom, telephone, email, service, message, status, payment_status) VALUES
('Jean Dupont', '+237123456789', 'jean@test.com', 'diagnostic', 'Test diagnostic', 'nouveau', 'pending'),
('Marie Martin', '+237987654321', 'marie@test.com', 'vidange', 'Vidange urgente', 'confirme', 'paid'),
('Paul Mballa', '+237555123456', 'paul@test.com', 'climatisation', 'Clim en panne', 'nouveau', 'pending'),
('Sophie Ngono', '+237666789123', 'sophie@test.com', 'freinage', 'Freins défaillants', 'en_cours', 'paid'),
('David Kouam', '+237777456123', 'david@test.com', 'pneus', 'Changement pneus', 'termine', 'paid');

-- Paiements de test
INSERT INTO payments (rendezvous_id, amount, currency, status, payment_method, stripe_payment_id, metadata) 
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
    'pi_test_' || substr(md5(random()::text), 1, 10),
    jsonb_build_object(
        'service_name', r.service, 
        'customer_name', r.nom,
        'test_data', true
    )
FROM rendezvous r
WHERE r.payment_status = 'paid';

-- Vérification finale avec comptage
DO $$
DECLARE
    rdv_count integer;
    pay_count integer;
BEGIN
    SELECT COUNT(*) INTO rdv_count FROM rendezvous;
    SELECT COUNT(*) INTO pay_count FROM payments;
    
    RAISE NOTICE '=== MIGRATION TERMINÉE ===';
    RAISE NOTICE 'Rendez-vous: % enregistrements', rdv_count;
    RAISE NOTICE 'Paiements: % enregistrements', pay_count;
    RAISE NOTICE 'Tables créées avec RLS activé';
    RAISE NOTICE 'Politiques permissives appliquées';
    RAISE NOTICE 'Index créés pour les performances';
    RAISE NOTICE '=========================';
END $$;