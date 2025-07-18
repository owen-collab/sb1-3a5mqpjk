import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Shield, Award, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { rendezVousService } from '../lib/supabase';
import { AuthUser } from '../lib/auth';

interface ContactProps {
  user: AuthUser | null;
}

const Contact: React.FC<ContactProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    telephone: user?.telephone || '',
    email: user?.email || '',
    service: '',
    date: '',
    heure: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const services = [
    'Vidange',
    'Révision complète',
    'Freinage',
    'Climatisation',
    'Diagnostic électronique',
    'Carrosserie',
    'Autre'
  ];

  const heures = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await rendezVousService.create({
        ...formData,
        user_id: user?.id || null
      });
      
      setSubmitStatus('success');
      if (!user) {
        setFormData({
          nom: '',
          telephone: '',
          email: '',
          service: '',
          date: '',
          heure: '',
          message: ''
        });
      } else {
        setFormData(prev => ({
          ...prev,
          service: '',
          date: '',
          heure: '',
          message: ''
        }));
      }
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitStatus('error');
      
      if (error.message && error.message.includes('créneau')) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            Prenez Rendez-vous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Réservez votre créneau en quelques clics. Notre équipe vous contactera pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">Nos Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Téléphone</p>
                    <p className="text-gray-600">+237 6XX XXX XXX</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Email</p>
                    <p className="text-gray-600">contact@autogarage.cm</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Adresse</p>
                    <p className="text-gray-600">123 Avenue de la République, Douala</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Horaires</p>
                    <p className="text-gray-600">Lun-Ven: 8h-18h | Sam: 8h-12h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateurs de confiance */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-black mb-4">Pourquoi nous choisir ?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Garantie sur tous nos services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Mécaniciens certifiés</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Plus de 1000 clients satisfaits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-black mb-6">Réserver un Rendez-vous</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Votre demande de rendez-vous a été envoyée avec succès !</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-black mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Votre nom complet"
                  />
                </div>
                
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-black mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-black mb-2">
                  Service souhaité *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Sélectionnez un service</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-black mb-2">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="heure" className="block text-sm font-medium text-black mb-2">
                    Heure souhaitée
                  </label>
                  <select
                    id="heure"
                    name="heure"
                    value={formData.heure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Sélectionnez une heure</option>
                    {heures.map(heure => (
                      <option key={heure} value={heure}>{heure}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Décrivez votre problème ou vos besoins spécifiques..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-black to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-gray-800 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma Demande de RDV'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;