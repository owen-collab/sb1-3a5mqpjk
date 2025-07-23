import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function RegisterDebug() {
  const [name, setName] = useState("owen nguedjio");
  const [phone, setPhone] = useState("+237696990545");
  const [email, setEmail] = useState("owennguedjio4@gmail.com");
  const [password, setPassword] = useState("Owen209@");
  const [output, setOutput] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setOutput("Création du compte...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: phone }
      }
    });

    if (error) {
      setOutput("❌ Erreur Supabase : " + error.message);
    } else {
      setOutput("✅ Compte créé avec succès !\n" + JSON.stringify(data, null, 2));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Debug Inscription Supabase</h1>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
        <button type="submit">Créer mon compte</button>
      </form>
      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap", background: "#f3f3f3", padding: 10 }}>
        {output}
      </pre>
    </div>
  );
}
