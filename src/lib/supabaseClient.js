import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes')
  console.error('Assurez-vous d\'avoir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)