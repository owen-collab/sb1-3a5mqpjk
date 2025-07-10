/*
  # Configuration complète de la base de données IN AUTO

  1. Nouvelles Tables
    - `rendezvous` : Stockage des demandes de rendez-vous clients
    - `payments` : Enregistrement des transactions de paiement

  2. Sécurité
    - Activation de Row Level Security (RLS)
    - Politiques d'accès pour utilisateurs anonymes et authentifiés

  3. Fonctionnalités
    - Triggers automatiques pour updated_at
    - Index pour optimiser les performances
    - Données de test pour validation
*/

-- Vérifier et créer la table rendezvous si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'rendezvous') THEN
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
    END IF;
END $$;

-- Vérifier et créer la table payments si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
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
    END IF;
END $$;

-- Activer RLS sur les tables
ALTER TABLE rendezvous ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent pour éviter les conflits
DROP POLICY IF EXISTS "Anyone can create rendezvous" ON rendezvous;
DROP POLICY IF EXISTS "Authenticated users can view all rendezvous" ON rendezvous;
DROP POLICY IF EXISTS "Authenticated users can update rendezvous" ON rendezvous;
DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can view all payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments;

-- Créer les politiques pour rendezvous
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

-- Créer les politiques pour payments
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

-- Créer la fonction update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les triggers existants s'ils existent
DROP TRIGGER IF EXISTS update_rendezvous_updated_at ON rendezvous;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;

-- Créer les triggers
CREATE TRIGGER update_rendezvous_updated_at
    BEFORE UPDATE ON rendezvous
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX IF NOT EXISTS idx_rendezvous_status ON rendezvous(status);
CREATE INDEX IF NOT EXISTS idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Insérer des données de test si les tables sont vides
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM rendezvous LIMIT 1) THEN
        INSERT INTO rendezvous (nom, telephone, email, service, message, status, payment_status) VALUES
        ('Test Client', '+237123456789', 'test@example.com', 'diagnostic', 'Test de la base de données', 'nouveau', 'pending'),
        ('Marie Dupont', '+237987654321', 'marie@example.com', 'vidange', 'Vidange complète nécessaire', 'confirme', 'paid'),
        ('Jean Martin', '+237555123456', NULL, 'climatisation', 'Problème de climatisation', 'nouveau', 'pending');
    END IF;
END $$;