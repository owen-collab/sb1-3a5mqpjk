import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

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
        <App />
      </StrictMode>
    );
    
    console.log('✅ Application rendue avec succès!');
  } catch (error) {
    console.error('💥 Erreur lors du rendu:', error);
    
    // Fallback simple en cas d'erreur
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        background: #1f2937;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div style="max-width: 600px;">
          <h1 style="
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ffffff, #dc2626);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            IN AUTO
          </h1>
          
          <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
            Garage Automobile Professionnel à Douala
          </p>
          
          <div style="
            background-color: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          ">
            <h2 style="margin-bottom: 1rem; color: #dc2626;">🚗 Nos Services</h2>
            <div style="text-align: left; font-size: 0.9rem;">
              <p>✅ Diagnostic électronique - 15 000 FCFA</p>
              <p>✅ Vidange complète - 35 000 FCFA</p>
              <p>✅ Climatisation - 25 000 FCFA</p>
              <p>✅ Freinage - 45 000 FCFA</p>
              <p>✅ Pneus + géométrie - 15 000 FCFA</p>
            </div>
          </div>
          
          <div style="
            background-color: rgba(220, 38, 38, 0.1);
            border: 2px solid #dc2626;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          ">
            <h3 style="color: #dc2626; margin-bottom: 1rem;">📞 Contact</h3>
            <p><strong>Téléphone:</strong> (+237) 675 978 777</p>
            <p><strong>Adresse:</strong> Rue PAU, Akwa, Douala</p>
            <p><strong>Email:</strong> infos@inauto.fr</p>
            <p><strong>Horaires:</strong> Lun-Sam 8h-18h</p>
          </div>
          
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a
              href="tel:+237675978777"
              style="
                background-color: #dc2626;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
              "
            >
              📞 Appeler Maintenant
            </a>
          </div>
          
          <div style="
            margin-top: 2rem;
            padding: 1rem;
            background-color: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 8px;
            font-size: 0.875rem;
          ">
            <p style="color: #ef4444; margin: 0;">
              ⚠️ Erreur de chargement React - Mode de secours activé
            </p>
            <button onclick="window.location.reload()" style="
              background: #ef4444;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              margin-top: 0.5rem;
            ">
              🔄 Recharger
            </button>
          </div>
        </div>
      </div>
    `;
  }
}