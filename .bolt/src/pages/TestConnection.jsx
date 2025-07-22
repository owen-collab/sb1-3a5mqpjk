import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function TestConnection() {
  async function handleTest() {
    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

    const { data, error } = await supabase.from("rendez_vous").select("*").limit(1);
    if (error) {
      alert("Erreur Supabase: " + error.message);
    } else {
      alert("Connexion OK, data: " + JSON.stringify(data));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Test connexion Supabase</h1>
      <button onClick={handleTest}>Tester</button>
    </div>
  );
}
