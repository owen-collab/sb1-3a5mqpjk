import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Import components
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Blog from './components/Blog';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import DebugSupabase from './components/DebugSupabase';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';

// Import services
import { authService, AuthUser } from './lib/auth';
import { notificationService } from './lib/notifications';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 App useEffect running...');
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for existing user session
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('✅ User session restored:', currentUser.email);
      }

      // Set up auth state listener
      if (supabase) {
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 Auth state changed:', event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });
      }

      // Start notification processing (if configured)
      if (supabase) {
        // Process notifications every 30 seconds
        const notificationInterval = setInterval(() => {
          notificationService.processNotifications().catch(console.warn);
        }, 30000);

        // Cleanup interval on unmount
        return () => clearInterval(notificationInterval);
      }

    } catch (err) {
      console.error('❌ Error initializing app:', err);
      setError('Erreur lors de l\'initialisation de l\'application');
    } finally {
      setLoading(false);
      console.log('✅ App initialized successfully');
    }
  };

  const handleAuthSuccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setShowAuthModal(false);
      console.log('✅ Authentication successful');
    } catch (err) {
      console.error('❌ Error after auth success:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (err) {
      console.error('❌ Error signing out:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-red-100 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-black to-red-600 bg-clip-text text-transparent">
              IN AUTO
            </h2>
            <p className="text-gray-600 text-lg">
              Chargement de votre garage de confiance...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  // Main application
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Main website route */}
          <Route path="/" element={
            <>
              <Header 
                user={user} 
                onShowAuth={() => setShowAuthModal(true)}
                onSignOut={handleSignOut}
              />
              <main>
                <Hero />
                <Stats />
                <Services />
                <About />
                <Testimonials />
                <Blog />
                <Contact user={user} />
              </main>
              <Footer />
              <Chatbot />
            </>
          } />
          
          {/* User dashboard route */}
          <Route path="/dashboard" element={
            user ? (
              <UserDashboard user={user} onSignOut={handleSignOut} />
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion requise</h2>
                  <p className="text-gray-600 mb-6">
                    Vous devez être connecté pour accéder à votre espace client.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 w-full"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            )
          } />
          
          {/* Admin dashboard route */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Debug route */}
          <Route path="/debug" element={<DebugSupabase />} />
          
          {/* 404 route */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Page non trouvée</h1>
                <p className="text-gray-600 mb-8">
                  La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <a
                  href="/"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
        
        {/* Authentication Modal */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;