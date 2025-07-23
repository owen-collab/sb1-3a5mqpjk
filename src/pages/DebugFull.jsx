import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function DebugFull() {
  const [output, setOutput] = useState("Clique sur Tester pour lancer les vérifications...");

  async function handleTest() {
    let logs = [];

    logs.push("=== Diagnostic Supabase ===");
    logs.push(`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL}`);
    logs.push(`VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? "Définie" : "NON DÉFINIE"}`);

    // Test de connexion
    logs.push("\n--- Test de connexion ---");
    const { data: testData, error: testError } = await supabase.from("paiements").select("*").limit(1);
    if (testError) {
      logs.push("Erreur de connexion: " + testError.message);
      setOutput(logs.join("\n"));
      return;
    }
    logs.push("Connexion OK. Paiements lus: " + testData.length);

    // Test d'insertion
    logs.push("\n--- Test d'insertion ---");
    const { data: insertData, error: insertError } = await supabase
      .from("rendez_vous")
      .insert([{ client: "Debug Client", date: new Date() }])
      .select();

    if (insertError) {
      logs.push("Erreur d'insertion: " + insertError.message);
    } else {
      logs.push("Insertion OK: " + JSON.stringify(insertData));
    }

    // Lecture des derniers rendez-vous
    logs.push("\n--- Lecture des rendez-vous ---");
    const { data: allData, error: readError } = await supabase
      .from("rendez_vous")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (readError) {
      logs.push("Erreur de lecture: " + readError.message);
    } else {
      logs.push("Derniers rendez-vous: " + JSON.stringify(allData));
    }

    setOutput(logs.join("\n"));
  }

  return (
    <div style={{ padding: 20, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      <h1>Diagnostic complet Supabase</h1>
      <button onClick={handleTest}>Tester</button>
      <div style={{ marginTop: 20 }}>{output}</div>
    </div>
  );
}
