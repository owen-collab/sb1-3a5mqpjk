export default function Debug() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Debug Supabase</h1>
      <p><b>URL :</b> {import.meta.env.VITE_SUPABASE_URL || 'NON DÉFINIE'}</p>
      <p><b>Clé :</b> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Définie' : 'NON DÉFINIE'}</p>
    </div>
  );
}
