import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    telephone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation des champs
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup' && (!formData.nom || !formData.telephone)) {
      setError('Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      setIsLoading(false);
      return;
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 Début de la soumission du formulaire');
      console.log('🔍 Mode:', mode);
      console.log('🔍 Email:', formData.email);
      console.log('🔍 Nom:', formData.nom);
      console.log('🔍 Téléphone:', formData.telephone);
      
      if (mode === 'signup') {
        console.log('🔍 Appel de authService.signUp...');
        await authService.signUp(formData.email, formData.password, {
          nom: formData.nom,
          telephone: formData.telephone
        });
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setMode('signin');
        // Réinitialiser le formulaire après inscription réussie
        setFormData({
          email: formData.email, // Garder l'email pour faciliter la connexion
          password: '',
          nom: '',
          telephone: ''
        });
      } else {
        console.log('🔍 Appel de authService.signIn...');
        await authService.signIn(formData.email, formData.password);
        setSuccess('Connexion réussie !');
        setTimeout(() => {
          onAuthSuccess();
          onClose();
          // Réinitialiser le formulaire
          setFormData({
            email: '',
            password: '',
            nom: '',
            telephone: ''
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification:', err);
      console.error('Type d\'erreur auth:', typeof err);
      console.error('Message d\'erreur auth:', err.message);
      console.error('Stack trace auth:', err.stack);
      
      // Messages d'erreur plus explicites
      let errorMessage = 'Une erreur est survenue';
      
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'Un compte existe déjà avec cette adresse email';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        } else if (err.message.includes('Database error')) {
          errorMessage = 'Erreur de base de données. Veuillez vérifier votre configuration Supabase.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else if (err.message.includes('Supabase non configuré')) {
          errorMessage = 'Configuration Supabase manquante. Vérifiez vos variables d\'environnement.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
            </h3>
            <p className="text-gray-600">
              {mode === 'signin' 
                ? 'Accédez à votre espace client' 
                : 'Rejoignez la communauté IN AUTO'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div className="flex-1">
                <span className="text-red-700 text-sm">{error}</span>
                {error.includes('configuration Supabase') && (
                  <div className="mt-2 text-xs text-red-600">
                    <p>• Vérifiez votre fichier .env</p>
                    <p>• Redémarrez le serveur de développement</p>
                    <p>• Consultez la page /debug pour plus d'informations</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-black to-red-600 hover:from-gray-800 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'signin' ? 'Connexion...' : 'Création...'}
                </div>
              ) : (
                mode === 'signin' ? 'Se connecter' : 'Créer mon compte'
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Avantages de votre compte client :
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Gérer vos rendez-vous en ligne
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Historique de vos services
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Notifications automatiques
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Suivi en temps réel
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;