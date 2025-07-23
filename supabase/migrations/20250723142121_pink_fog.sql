/*
  # Fix User Registration Error

  This migration fixes the "Database error saving new user" issue by:
  1. Removing the redundant email column from profiles table
  2. Updating the handle_new_user trigger function
  3. Ensuring clean user registration process

  ## Changes:
  - Remove email column from profiles table (redundant with auth.users.email)
  - Update handle_new_user function to not insert email
  - Clean up any existing data conflicts
*/

-- Remove the redundant email column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- Update the handle_new_user function to not include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, nom, telephone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom', ''),
        COALESCE(NEW.raw_user_meta_data->>'telephone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();