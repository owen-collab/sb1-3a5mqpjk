import { supabase } from './supabaseClient'

export async function testSupabaseConnection() {
  const { data, error } = await supabase.from('rendezvous').select('*').limit(1)
  if (error) {
    console.error('❌ Erreur Supabase:', error.message)
  } else {
    console.log('✅ Connexion Supabase réussie:', data)
  }
}

export async function debugSupabase() {
    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

    const { data, error } = await supabase.from("rendezvous").select("*").limit(1);
    if (error) {
      alert("Erreur Supabase: " + error.message);
    } else {
      alert("Connexion réussie! Données: " + JSON.stringify(data));
    }
}