import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function DebugAll() {
  const [output, setOutput] = useState("Chargement des tests...");

  useEffect(() => {
    async function runFullDebug() {
      let logs = [];

      logs.push("=== DEBUG COMPLET SUPABASE ===");
      logs.push(`URL: ${import.meta.env.VITE_SUPABASE_URL || "NON DÉFINIE"}`);
      logs.push(`Clé Anon: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? "Définie" : "NON DÉFINIE"}`);

      // 1. Vérifier la connexion
      logs.push("\n--- Test connexion ---");
      const { data: testData, error: testError } = await supabase.from("payments").select("*").limit(1);
      if (testError) {
        logs.push("Erreur de connexion: " + testError.message);
        setOutput(logs.join("\n"));
        return;
      }
      logs.push("Connexion OK. Payments lus: " + testData.length);

      // 2. Lister toutes les tables (via pg_catalog)
      logs.push("\n--- Liste des tables ---");
      const { data: tables, error: tablesError } = await supabase
        .rpc("pg_tables"); // RPC "pg_tables" fonctionne si configuré
      if (tablesError) {
        logs.push("Impossible de lister les tables: " + tablesError.message);
      } else {
        logs.push("Tables disponibles: " + JSON.stringify(tables));
      }

      // 3. Colonnes de rendezvous
      logs.push("\n--- Colonnes de rendezvous ---");
      const { data: columns, error: columnsError } = await supabase
        .from("rendezvous")
        .select("*")
        .limit(0);
      if (columnsError) {
        logs.push("Erreur en lisant la structure: " + columnsError.message);
      } else {
        logs.push("Colonnes détectées: " + Object.keys(columns[0] || {}).join(", "));
      }

      // 4. Test d'insertion
      logs.push("\n--- Test d'insertion ---");
      const { data: insertData, error: insertError } = await supabase
        .from("rendezvous")
        .insert([{ client: "Debug All", date: new Date() }])
        .select();

      if (insertError) {
        logs.push("Erreur d'insertion: " + insertError.message);
      } else {
        logs.push("Insertion OK: " + JSON.stringify(insertData));
      }

      // 5. Lecture des derniers rendezvous
      logs.push("\n--- Rendezvous ---");
      const { data: rdvs, error: rdvError } = await supabase
        .from("rendezvous")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (rdvError) {
        logs.push("Erreur lecture rendezvous: " + rdvError.message);
      } else {
        logs.push("Derniers rendezvous: " + JSON.stringify(rdvs));
      }

      // 6. Lecture des derniers paiements
      logs.push("\n--- Paiements ---");
      const { data: pays, error: payError } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (payError) {
        logs.push("Erreur lecture payments: " + payError.message);
      } else {
        logs.push("Derniers payments: " + JSON.stringify(pays));
      }

      setOutput(logs.join("\n"));
    }

    runFullDebug();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      <h1>Debug complet Supabase</h1>
      <div style={{ marginTop: 20 }}>{output}</div>
    </div>
  );
}
