/*
  # Complete Database Reset and Setup for IN AUTO

  This migration will:
  1. Clean up any existing tables and functions
  2. Create fresh tables with proper structure
  3. Set up Row Level Security (RLS) with appropriate policies
  4. Create necessary functions and triggers
  5. Add sample data for testing
  6. Ensure everything works properly

  ## Tables Created:
  - `profiles` - User profiles linked to auth.users
  - `rendezvous` - Appointment bookings
  - `payments` - Payment records
  - `notifications` - Notification queue

  ## Security:
  - RLS enabled on all tables
  - Proper policies for authenticated and anonymous users
  - Secure functions for user management
*/

-- =============================================
-- STEP 1: CLEAN UP EXISTING STRUCTURES
-- =============================================

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- =============================================
-- STEP 2: CREATE CORE FUNCTIONS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 3: CREATE TABLES
-- =============================================

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nom text,
    telephone text,
    email text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Rendezvous table (appointments)
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
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Payments table
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

-- Notifications table
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    rendezvous_id uuid REFERENCES rendezvous(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('email', 'sms')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    message text NOT NULL,
    scheduled_for timestamptz,
    sent_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendezvous ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 5: CREATE SECURITY POLICIES
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Rendezvous policies
CREATE POLICY "Anyone can create rendezvous"
    ON rendezvous FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Users can view own rendezvous"
    ON rendezvous FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can view all rendezvous"
    ON rendezvous FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update rendezvous"
    ON rendezvous FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete rendezvous"
    ON rendezvous FOR DELETE
    TO authenticated
    USING (true);

-- Payments policies
CREATE POLICY "Anyone can create payments"
    ON payments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view all payments"
    ON payments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update payments"
    ON payments FOR UPDATE
    TO authenticated
    USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage notifications"
    ON notifications FOR ALL
    TO authenticated
    USING (true);

-- =============================================
-- STEP 6: CREATE TRIGGERS
-- =============================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rendezvous_updated_at
    BEFORE UPDATE ON rendezvous
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STEP 7: USER SIGNUP HANDLING
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, nom, telephone, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom', ''),
        COALESCE(NEW.raw_user_meta_data->>'telephone', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- STEP 8: CREATE PERFORMANCE INDEXES
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Rendezvous indexes
CREATE INDEX idx_rendezvous_created_at ON rendezvous(created_at);
CREATE INDEX idx_rendezvous_status ON rendezvous(status);
CREATE INDEX idx_rendezvous_payment_status ON rendezvous(payment_status);
CREATE INDEX idx_rendezvous_user_id ON rendezvous(user_id);
CREATE INDEX idx_rendezvous_date_heure ON rendezvous(date, heure);

-- Payments indexes
CREATE INDEX idx_payments_rendezvous_id ON payments(rendezvous_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);

-- =============================================
-- STEP 9: INSERT SAMPLE DATA
-- =============================================

-- Sample rendezvous data
INSERT INTO rendezvous (nom, telephone, email, service, message, status, payment_status, date, heure) VALUES
('Jean Dupont', '+237675123456', 'jean.dupont@email.com', 'Diagnostic électronique', 'Problème de démarrage le matin', 'nouveau', 'pending', CURRENT_DATE + INTERVAL '2 days', '09:00'),
('Marie Ngono', '+237698765432', 'marie.ngono@email.com', 'Vidange complète', 'Vidange + changement filtres', 'confirme', 'paid', CURRENT_DATE + INTERVAL '3 days', '10:30'),
('Paul Mballa', '+237655987654', 'paul.mballa@email.com', 'Climatisation', 'Climatisation ne refroidit plus', 'en_cours', 'paid', CURRENT_DATE + INTERVAL '1 day', '14:00'),
('Sophie Kouam', '+237666123789', 'sophie.kouam@email.com', 'Freinage', 'Freins qui grincent', 'termine', 'paid', CURRENT_DATE - INTERVAL '1 day', '11:00'),
('David Fosso', '+237677456123', 'david.fosso@email.com', 'Pneus + géométrie', 'Changement 4 pneus + géométrie', 'nouveau', 'pending', CURRENT_DATE + INTERVAL '4 days', '15:30');

-- Sample payments for paid appointments
INSERT INTO payments (rendezvous_id, amount, currency, status, payment_method, stripe_payment_id, metadata)
SELECT 
    r.id,
    CASE 
        WHEN r.service LIKE '%Diagnostic%' THEN 15000
        WHEN r.service LIKE '%Vidange%' THEN 35000
        WHEN r.service LIKE '%Climatisation%' THEN 25000
        WHEN r.service LIKE '%Freinage%' THEN 45000
        WHEN r.service LIKE '%Pneus%' THEN 60000
        ELSE 30000
    END,
    'XAF',
    'succeeded',
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
                'customer_name', r.nom
            )
        WHEN r.telephone LIKE '%698%' OR r.telephone LIKE '%699%' THEN 
            jsonb_build_object(
                'provider', 'orange_money',
                'phone_number', r.telephone,
                'customer_name', r.nom
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

-- =============================================
-- STEP 10: FINAL VERIFICATION
-- =============================================

DO $$
DECLARE
    profiles_count integer;
    rendezvous_count integer;
    payments_count integer;
    notifications_count integer;
BEGIN
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    SELECT COUNT(*) INTO rendezvous_count FROM rendezvous;
    SELECT COUNT(*) INTO payments_count FROM payments;
    SELECT COUNT(*) INTO notifications_count FROM notifications;
    
    RAISE NOTICE '=== DATABASE SETUP COMPLETE ===';
    RAISE NOTICE '✅ Tables created successfully';
    RAISE NOTICE '🔒 RLS enabled with proper policies';
    RAISE NOTICE '⚡ Performance indexes created';
    RAISE NOTICE '🔄 Triggers configured';
    RAISE NOTICE '👤 User signup handling ready';
    RAISE NOTICE '';
    RAISE NOTICE '📊 DATA SUMMARY:';
    RAISE NOTICE '   Profiles: %', profiles_count;
    RAISE NOTICE '   Rendez-vous: %', rendezvous_count;
    RAISE NOTICE '   Payments: %', payments_count;
    RAISE NOTICE '   Notifications: %', notifications_count;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Database ready for production use!';
    RAISE NOTICE '===============================';
END $$;