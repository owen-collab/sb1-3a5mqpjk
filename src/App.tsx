import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
import { authService, AuthUser } from './lib/auth';
import { notificationService } from './lib/notifications';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    // Only start notification processing if Supabase is available
    if (supabase) {
      const notificationInterval = setInterval(() => {
        try {
          notificationService.processNotifications();
        } catch (error) {
          console.warn('Notification processing error:', error);
        }
      }, 30000);

      return () => clearInterval(notificationInterval);
    }
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleAuthSuccess = () => {
    checkUser();
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto mb-6" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-red-100 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">IN AUTO</h2>
          <p className="text-gray-600 animate-pulse">Chargement de votre garage de confiance...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Page principale */}
          <Route path="/" element={
            <>
              <Header 
                user={user} 
                onShowAuth={() => setShowAuthModal(true)}
                onSignOut={handleSignOut}
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
          
          {/* User Dashboard */}
          <Route path="/dashboard" element={
            user ? (
              <UserDashboard user={user} onSignOut={handleSignOut} />
            ) : (
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion requise</h2>
                  <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre espace client</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-black to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-red-700"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            )
          } />
          
          {/* Dashboard admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Page de debug Supabase */}
          <Route path="/debug" element={<DebugSupabase />} />
        </Routes>
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </Router>
  );
}

export default App;