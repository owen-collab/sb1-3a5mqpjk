import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 Application starting...');

// Ensure the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = `
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; color: red;">
      <h1>Erreur de configuration</h1>
      <p>L'élément root n'a pas été trouvé dans le DOM.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Recharger la page
      </button>
    </div>
  `;
  throw new Error('Root element not found');
}

console.log('✅ Root element found, creating React app...');

// Simple error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('💥 Application Error:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Erreur de chargement</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Une erreur est survenue lors du chargement de l'application IN AUTO.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Recharger la page
          </button>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
            Si le problème persiste, vérifiez la console du navigateur.
          </div>
        </div>
      </div>
    );
  }
};

// Test render function
const TestComponent = () => {
  console.log('🧪 TestComponent rendering...');
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #000000, #dc2626)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          IN AUTO
        </div>
        <div style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Garage Automobile Professionnel
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            ✅ React fonctionne correctement<br/>
            ✅ CSS chargé avec succès<br/>
            ✅ Application initialisée
          </div>
        </div>
        <button
          onClick={() => {
            console.log('🔄 Switching to full app...');
            window.location.hash = '#full-app';
            window.location.reload();
          }}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Charger l'application complète
        </button>
      </div>
    </div>
  );
};

try {
  console.log('🔧 Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('🎨 Rendering application...');
  
  // Check if we should load the full app or test component
  const shouldLoadFullApp = window.location.hash === '#full-app' || 
                           localStorage.getItem('loadFullApp') === 'true';
  
  if (shouldLoadFullApp) {
    console.log('📱 Loading full application...');
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } else {
    console.log('🧪 Loading test component first...');
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      </StrictMode>
    );
  }
  
  console.log('✅ Application rendered successfully!');
} catch (error) {
  console.error('💥 Fatal error during rendering:', error);
  rootElement.innerHTML = `
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
      <h1 style="color: #dc2626;">Erreur Critique</h1>
      <p>Impossible de démarrer l'application React.</p>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 4px; text-align: left; overflow: auto;">
        ${error instanceof Error ? error.message : 'Erreur inconnue'}
      </pre>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 1rem;">
        Recharger
      </button>
    </div>
  `;
}