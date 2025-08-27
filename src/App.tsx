import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Import components with error handling
let Header, Hero, Services, About, Stats, Testimonials, Contact, Footer, Blog, Chatbot;
let AdminDashboard, DebugSupabase, AuthModal, UserDashboard;
let authService, notificationService, supabase;

try {
  Header = require('./components/Header').default;
  Hero = require('./components/Hero').default;
  Services = require('./components/Services').default;
  About = require('./components/About').default;
  Stats = require('./components/Stats').default;
  Testimonials = require('./components/Testimonials').default;
  Contact = require('./components/Contact').default;
  Footer = require('./components/Footer').default;
  Blog = require('./components/Blog').default;
  Chatbot = require('./components/Chatbot').default;
  AdminDashboard = require('./components/AdminDashboard').default;
  DebugSupabase = require('./components/DebugSupabase').default;
  AuthModal = require('./components/AuthModal').default;
  UserDashboard = require('./components/UserDashboard').default;
  
  const authModule = require('./lib/auth');
  authService = authModule.authService;
  
  const notificationModule = require('./lib/notifications');
  notificationService = notificationModule.notificationService;
  
  const supabaseModule = require('./lib/supabase');
  supabase = supabaseModule.supabase;
} catch (error) {
  console.error('Error loading components:', error);
}

// Simple fallback component
const SimpleApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ffffff, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            IN AUTO
          </div>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#accueil" style={{ color: 'white', textDecoration: 'none' }}>Accueil</a>
            <a href="#services" style={{ color: 'white', textDecoration: 'none' }}>Services</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #dc2626 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Votre Expert Automobile de Confiance
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Garage professionnel à Douala - Diagnostic, entretien et réparation toutes marques
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#contact"
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
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Prendre Rendez-vous
            </a>
            <a
              href="tel:+237675978777"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: '2px solid white',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#1f2937';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              (+237) 675 978 777
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{
        padding: '4rem 1rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#1f2937'
          }}>
            Nos Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { title: 'Diagnostic Électronique', price: '15 000 FCFA', desc: 'Diagnostic complet avec valise professionnelle' },
              { title: 'Vidange + Entretien', price: '35 000 FCFA', desc: 'Vidange complète avec huile de qualité' },
              { title: 'Climatisation', price: '25 000 FCFA', desc: 'Entretien et réparation système de climatisation' },
              { title: 'Freinage', price: '45 000 FCFA', desc: 'Contrôle et réparation système de freinage' },
              { title: 'Pneus + Géométrie', price: '15 000 FCFA', desc: 'Montage, équilibrage et géométrie' },
              { title: 'Révision Complète', price: '75 000 FCFA', desc: 'Révision selon carnet constructeur' }
            ].map((service, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {service.desc}
                </p>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  marginBottom: '1rem'
                }}>
                  {service.price}
                </div>
                <a
                  href="#contact"
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Réserver
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: '4rem 1rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            color: '#1f2937'
          }}>
            Contactez-nous
          </h2>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong>📍 Adresse :</strong> Rue PAU, Akwa, Douala
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>📞 Téléphone :</strong> (+237) 675 978 777
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>✉️ Email :</strong> infos@inauto.fr
            </div>
            <div>
              <strong>🕒 Horaires :</strong> Lun-Sam: 8h00-18h00
            </div>
          </div>
          <a
            href="tel:+237675978777"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Appeler Maintenant
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            IN AUTO
          </div>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
            Votre partenaire automobile de confiance à Douala
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>
            © 2025 IN AUTO. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Main App component with error handling
function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 App useEffect running...');
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('✅ App loaded successfully');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // If components failed to load, show simple app
  if (!Header || !Hero || !Services) {
    console.log('⚠️ Some components failed to load, showing simple app');
    return <SimpleApp />;
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Loader2 style={{
              width: '4rem',
              height: '4rem',
              color: '#dc2626',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            IN AUTO
          </h2>
          <p style={{ color: '#6b7280' }}>
            Chargement de votre garage de confiance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Erreur</h1>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
          <Routes>
            <Route path="/" element={
              <>
                <Header 
                  user={user} 
                  onShowAuth={() => setShowAuthModal(true)}
                  onSignOut={() => setUser(null)}
                />
                <Hero />
                <Stats />
                <Services />
                <About />
                <Testimonials />
                <Blog />
                <Contact user={user} />
                <Footer />
                <Chatbot />
              </>
            } />
            
            <Route path="/dashboard" element={
              user ? (
                <UserDashboard user={user} onSignOut={() => setUser(null)} />
              ) : (
                <SimpleApp />
              )
            } />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/debug" element={<DebugSupabase />} />
          </Routes>
          
          {AuthModal && (
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onAuthSuccess={() => {
                setShowAuthModal(false);
                // Handle auth success
              }}
            />
          )}
        </div>
      </Router>
    );
  } catch (error) {
    console.error('💥 Error in main App render:', error);
    return <SimpleApp />;
  }
}

export default App;