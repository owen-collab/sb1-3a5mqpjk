@@ .. @@
 import { supabase } from './supabaseClient'

 async function testConnection() {
-  const { data, error } = await supabase.from('your_table').select('*').limit(1)
+  const { data, error } = await supabase.from('rendezvous').select('*').limit(1)
   if (error) {
     console.error('❌ Erreur Supabase:', error.message)
   } else {
@@ .. @@
     console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
     console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

-    const { data, error } = await supabase.from("rendez_vous").select("*").limit(1);
+    const { data, error } = await supabase.from("rendezvous").select("*").limit(1);
     if (error) {
       alert("Erreur Supabase: " + error.message);
     } else {