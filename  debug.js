import { supabase } from './supabaseClient'

async function testConnection() {
  const { data, error } = await supabase.from('your_table').select('*').limit(1)
  if (error) {
    console.error('❌ Erreur Supabase:', error.message)
  } else {
    console.log('✅ Connexion réussie. Exemple de data:', data)
  }
}

testConnection()
