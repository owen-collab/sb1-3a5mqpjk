import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, AlertCircle, CheckCircle, Star, Award, Shield, Users } from 'lucide-react';
import { supabase, rendezVousService, testSupabaseConnection } from '../lib/supabase';
import PaymentModal from './PaymentModal';
import { getServicePrice, ServicePrice } from '../lib/stripe';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    service: '',
    date: '',
    heure: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicePrice | null>(null);
  const [paymentOption, setPaymentOption] = useState<'later' | 'now'>('later');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Tester la connexion Supabase au chargement du composant
  React.useEffect(() => {
    const checkConnection = async () => {
      console.log('🔍 Vérification de la connexion Supabase...');
      const connected = await testSupabaseConnection();
      console.log('📊 Résultat de la connexion:', connected ? '✅ Connecté' : '❌ Échec');
      setIsSupabaseConnected(connected);
    };
    checkConnection();
  }, []);

  const trustIndicators = [
    { icon: Star, text: '4.9/5 étoiles', subtext: '500+ avis clients' },
    { icon: Award, text: 'Certifié Pro', subtext: 'Techniciens qualifiés' },
    { icon: Shield, text: 'Garantie 6 mois', subtext: 'Sur toutes interventions' },
    { icon: Users, text: '1000+ véhicules', subtext: 'Entretenus avec succès' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis.';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis.';
    } else if (!/^\+?[0-9\s\-\(\)]{9,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide.';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide.';
    }
    
    if (!formData.service) {
      newErrors.service = 'Veuillez choisir un service.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Paiement réussi:', paymentId);
    setSubmitStatus('success');
    setShowPaymentModal(false);
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      telephone: '',
      email: '',
      service: '',
      date: '',
      heure: '',
      message: ''
    });
    
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Début de soumission du formulaire');
    console.log('📝 Données du formulaire:', formData);
    console.log('💳 Option de paiement:', paymentOption);
    
    if (!validateForm()) {
      console.log('❌ Validation échouée');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Vérifier si un paiement est requis
    const servicePrice = getServicePrice(formData.service);
    const requiresPayment = servicePrice && servicePrice.price > 0 && paymentOption === 'now';

    try {
      if (requiresPayment) {
        // Ouvrir la modal de paiement
        console.log('💰 Paiement requis, ouverture de la modal');
        setSelectedService(servicePrice);
        setShowPaymentModal(true);
        setIsSubmitting(false);
        return;
      }

      if (isSupabaseConnected) {
        // Utiliser Supabase pour enregistrer le rendez-vous
        console.log('💾 Enregistrement du rendez-vous dans Supabase...');
        console.log('🔗 Supabase connecté:', isSupabaseConnected);
        
        const newRendezVous = await rendezVousService.create({
          ...formData,
          payment_status: paymentOption === 'now' ? 'paid' : 'pending'
        });
        console.log('✅ Rendez-vous enregistré avec succès !', newRendezVous);
        
        // Message de succès personnalisé
        setSuccessMessage(
          `Parfait ${formData.nom} ! Votre demande de rendez-vous pour "${formData.service}" a été enregistrée avec succès. ` +
          `Nous vous recontacterons au ${formData.telephone} dans les plus brefs délais.`
        );
      } else {
        // Simulation si Supabase n'est pas configuré
        console.warn('⚠️ Supabase non configuré, simulation de l\'envoi');
        console.log('🔄 Simulation en cours...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('✅ Simulation terminée');
        
        setSuccessMessage(
          `Merci ${formData.nom} ! Votre demande a été simulée avec succès. ` +
          `En mode production, nous vous recontacterions au ${formData.telephone}.`
        );
      }

      setSubmitStatus('success');
      setFormData({
        nom: '',
        telephone: '',
        email: '',
        service: '',
        date: '',
        heure: '',
        message: ''
      });
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        setSubmitStatus('idle');
        setSuccessMessage('');
      }, 8000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : 'Pas de stack',
        supabaseConnected: isSupabaseConnected
      });
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <Phone className="h-4 w-4 mr-2" />
            Contactez-nous
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Prenez
            <span className="block bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              Rendez-vous
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Réservez votre créneau facilement ou contactez-nous pour toute question. 
            Notre équipe d'experts est à votre disposition.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-xl mb-3">
                <indicator.icon className="h-6 w-6" />
              </div>
              <div className="font-bold text-gray-800">{indicator.text}</div>
              <div className="text-sm text-gray-600">{indicator.subtext}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Formulaire de contact amélioré */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              Réservez Votre Créneau
            </h3>
            
            {/* Indicateur de statut Supabase */}
            {isSupabaseConnected === false && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                <div className="text-sm">
                  <div className="font-semibold text-yellow-800">Mode démonstration</div>
                  <div className="text-yellow-700">Supabase non configuré. Les données ne seront pas sauvegardées.</div>
                </div>
              </div>
            )}
            
            {isSupabaseConnected === true && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div className="text-sm">
                  <div className="font-semibold text-green-800">Système connecté</div>
                  <div className="text-green-700">Vos données seront sauvegardées en sécurité.</div>
                </div>
              </div>
            )}
            
            {submitStatus === 'success' && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center animate-fadeInUp">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-800">Demande envoyée avec succès ! 🎉</div>
                  <div className="text-green-700">
                    {successMessage || 'Nous vous recontacterons dans les plus brefs délais.'}
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center animate-fadeInUp">
                <AlertCircle className="h-6 w-6 text-red-500 mr-4 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-800">Erreur lors de l'envoi !</div>
                  <div className="text-red-700">Veuillez vérifier les champs et réessayer.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-3">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Votre nom complet"
                  />
                  {errors.nom && <p className="text-red-500 text-xs mt-2 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.nom}
                  </p>}
                </div>
                <div className="form-group">
                  <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-3">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+237 6XX XXX XXX"
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-2 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.telephone}
                  </p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>}
              </div>

              <div className="form-group">
                <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-3">
                  Service souhaité *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.service ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choisir un service</option>
                  <option value="diagnostic">Diagnostic électronique</option>
                  <option value="vidange">Vidange + Entretien</option>
                  <option value="freinage">Système de freinage</option>
                  <option value="climatisation">Climatisation</option>
                  <option value="pneus">Pneus + Géométrie</option>
                  <option value="reparation">Réparation mécanique</option>
                  <option value="revision">Révision complète</option>
                  <option value="autre">Autre (préciser)</option>
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.service}
                </p>}
                
                {/* Affichage du prix du service */}
                {formData.service && getServicePrice(formData.service) && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Prix du service :</span>
                      <span className="font-bold text-blue-800">
                        {getServicePrice(formData.service)?.price === 0 
                          ? 'Sur devis' 
                          : `${getServicePrice(formData.service)?.price.toLocaleString()} FCFA`
                        }
                      </span>
                    </div>
                    {getServicePrice(formData.service)?.price > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-blue-600">Options de paiement :</p>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentOption"
                              value="later"
                              checked={paymentOption === 'later'}
                              onChange={(e) => setPaymentOption(e.target.value as 'later' | 'now')}
                              className="mr-2"
                            />
                            <span className="text-sm text-blue-700">Payer sur place</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentOption"
                              value="now"
                              checked={paymentOption === 'now'}
                              onChange={(e) => setPaymentOption(e.target.value as 'later' | 'now')}
                              className="mr-2"
                            />
                            <span className="text-sm text-blue-700">Payer maintenant (-5%)</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-3">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="heure" className="block text-sm font-semibold text-gray-700 mb-3">
                    Heure préférée
                  </label>
                  <select
                    id="heure"
                    name="heure"
                    value={formData.heure}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Choisir un créneau</option>
                    <option value="08h00">08h00 - 10h00</option>
                    <option value="10h00">10h00 - 12h00</option>
                    <option value="14h00">14h00 - 16h00</option>
                    <option value="16h00">16h00 - 18h00</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Décrivez votre problème ou vos besoins spécifiques..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform flex items-center justify-center shadow-xl ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Envoyer ma Demande de RDV
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Modal de paiement */}
          {showPaymentModal && selectedService && (
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={() => {
                setShowPaymentModal(false);
                setIsSubmitting(false);
              }}
              service={selectedService}
              customerInfo={{
                nom: formData.nom,
                telephone: formData.telephone,
                email: formData.email
              }}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">
                Nos Coordonnées
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Notre Adresse</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Rue PAU, Akwa<br />
                      En face AGROMAC<br />
                      À côté de la microfinance FIGEC<br />
                      Douala – Cameroun
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <Phone className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Téléphone</h4>
                    <p className="text-gray-700">
                      <a href="tel:+237675978777" className="text-blue-600 hover:underline font-semibold text-lg">
                        (+237) 675 978 777
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Disponible 7j/7 pour urgences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Email</h4>
                    <p className="text-gray-700">
                      <a href="mailto:infos@inauto.fr" className="text-blue-600 hover:underline">
                        infos@inauto.fr
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Réponse sous 2h en moyenne</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <Clock className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Horaires d'ouverture</h4>
                    <div className="text-gray-700 space-y-1">
                      <p><span className="font-semibold">Lundi - Samedi :</span> 8h00 - 18h00</p>
                      <p><span className="font-semibold">Dimanche :</span> Fermé</p>
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        🚨 Urgences : 24h/24 sur rendez-vous
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton d'urgence */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-8 w-8 mr-4" />
                <h4 className="text-2xl font-bold">Urgence Mécanique ?</h4>
              </div>
              <p className="text-lg opacity-90 mb-6">
                Panne sur route, problème urgent ? Notre équipe d'intervention rapide est disponible !
              </p>
              <a
                href="tel:+237675978777"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold inline-flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="h-6 w-6 mr-3" />
                Appel d'Urgence 24h/24
              </a>
            </div>

            {/* Carte */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Notre Localisation</h4>
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                  <p className="font-semibold text-lg">Rue PAU, Akwa</p>
                  <p className="text-gray-500">Douala, Cameroun</p>
                  <p className="text-sm mt-4 bg-white px-4 py-2 rounded-lg inline-block">
                    📍 En face d'AGROMAC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;