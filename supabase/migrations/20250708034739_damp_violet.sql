/*
  # Création des tables pour les paiements et rendez-vous

  1. Nouvelles Tables
    - `rendezvous`
      - `id` (uuid, primary key)
      - `nom` (text)
      - `telephone` (text)
      - `email` (text, optionnel)
      - `service` (text)
      - `date` (date, optionnel)
      - `heure` (text, optionnel)
      - `message` (text, optionnel)
      - `status` (text, default 'nouveau')
      - `payment_status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `payments`
      - `id` (uuid, primary key)
      - `rendezvous_id` (uuid, foreign key)
      - `stripe_payment_id` (text)
      - `amount` (integer)
      - `currency` (text, default 'XAF')
      - `status` (text)
      - `payment_method` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés et anonymes
*/

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS rendezvous (
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

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
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

-- Activer RLS
ALTER TABLE rendezvous ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour les rendez-vous
-- Permettre à tous de créer des rendez-vous (clients)
CREATE POLICY "Anyone can create rendezvous"
  ON rendezvous
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de voir tous les rendez-vous (admin)
CREATE POLICY "Authenticated users can view all rendezvous"
  ON rendezvous
  FOR SELECT
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de modifier les rendez-vous (admin)
CREATE POLICY "Authenticated users can update rendezvous"
  ON rendezvous
  FOR UPDATE
  TO authenticated
  USING (true);

-- Politiques pour les paiements
-- Permettre à tous de créer des paiements
CREATE POLICY "Anyone can create payments"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de voir tous les paiements (admin)
CREATE POLICY "Authenticated users can view all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de modifier les paiements (admin)
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX IF NOT EXISTS idx_rendezvous_status ON rendezvous(status);
CREATE INDEX IF NOT EXISTS idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);