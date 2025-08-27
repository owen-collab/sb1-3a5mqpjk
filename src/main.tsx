import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Version ultra-simple pour diagnostiquer le problème
const SimpleApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #ffffff, #dc2626)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          IN AUTO
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Garage Automobile Professionnel à Douala
        </p>
        
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>🚗 Nos Services</h2>
          <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
            <p>✅ Diagnostic électronique - 15 000 FCFA</p>
            <p>✅ Vidange complète - 35 000 FCFA</p>
            <p>✅ Climatisation - 25 000 FCFA</p>
            <p>✅ Freinage - 45 000 FCFA</p>
            <p>✅ Pneus + géométrie - 15 000 FCFA</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '2px solid #dc2626',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>📞 Contact</h3>
          <p><strong>Téléphone:</strong> (+237) 675 978 777</p>
          <p><strong>Adresse:</strong> Rue PAU, Akwa, Douala</p>
          <p><strong>Email:</strong> infos@inauto.fr</p>
          <p><strong>Horaires:</strong> Lun-Sam 8h-18h</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="tel:+237675978777"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
          >
            📞 Appeler Maintenant
          </a>
          
          <button
            onClick={() => {
              alert('Formulaire de contact à venir!\n\nEn attendant, appelez-nous au:\n(+237) 675 978 777');
            }}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: '2px solid white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📅 Prendre RDV
          </button>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          <p style={{ color: '#22c55e', margin: 0 }}>
            ✅ Site fonctionnel • React chargé • Prêt à vous servir
          </p>
        </div>
      </div>
    </div>
  );
};

// Fonction de test pour vérifier que tout fonctionne
console.log('🚀 Démarrage de l\'application IN AUTO...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Élément root introuvable!');
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      background: #dc2626;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">❌ Erreur Critique</h1>
        <p style="margin-bottom: 1rem;">L'élément root n'existe pas dans le DOM</p>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #dc2626;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        ">
          🔄 Recharger la page
        </button>
      </div>
    </div>
  `;
} else {
  console.log('✅ Élément root trouvé, création de l\'application...');
  
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <SimpleApp />
      </StrictMode>
    );
    
    console.log('✅ Application rendue avec succès!');
  } catch (error) {
    console.error('💥 Erreur lors du rendu:', error);
    
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        background: #dc2626;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">💥 Erreur React</h1>
          <p style="margin-bottom: 1rem;">Impossible de rendre l'application</p>
          <pre style="
            background: rgba(0,0,0,0.3);
            padding: 1rem;
            border-radius: 8px;
            text-align: left;
            font-size: 0.8rem;
            margin: 1rem 0;
            overflow: auto;
          ">${error.message}</pre>
          <button onclick="window.location.reload()" style="
            background: white;
            color: #dc2626;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          ">
            🔄 Recharger
          </button>
        </div>
      </div>
    `;
  }
}