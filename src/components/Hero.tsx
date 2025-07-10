import React from 'react';
import { Phone, Shield, Clock, Wrench, CheckCircle, ArrowRight, Star, Calendar, MapPin, Award } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-red-500 text-white min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="hero-content space-y-8">
            {/* Badge Premium */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold border border-white/30">
              <Star className="h-4 w-4 mr-2 text-yellow-400" />
              #1 Garage Premium à Douala
              <Award className="h-4 w-4 ml-2 text-yellow-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block">Votre Expert</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Automobile
              </span>
              <span className="block">de Confiance</span>
            </h1>

            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-2xl">
              Depuis notre création, nous révolutionnons l'entretien automobile à Douala avec 
              <span className="font-semibold text-yellow-400"> une technologie de pointe</span>, 
              <span className="font-semibold text-orange-400"> une transparence totale</span> et 
              <span className="font-semibold text-green-400"> un service client d'exception</span>.
            </p>

            {/* Features Grid Premium */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <Wrench className="h-10 w-10 text-yellow-400" />
                </div>
                <span className="text-sm font-semibold">Diagnostic Gratuit</span>
                <div className="text-xs opacity-75 mt-1">Technologie avancée</div>
              </div>
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
                <span className="text-sm font-semibold">Garantie 6 Mois</span>
                <div className="text-xs opacity-75 mt-1">Toutes interventions</div>
              </div>
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <Clock className="h-10 w-10 text-orange-400" />
                </div>
                <span className="text-sm font-semibold">Service Express</span>
                <div className="text-xs opacity-75 mt-1">Délais respectés</div>
              </div>
            </div>

            {/* CTAs Premium */}
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="#contact"
                className="group bg-gradient-to-r from-orange-500 via-red-500 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center flex items-center justify-center border-2 border-white/20"
              >
                <Calendar className="h-5 w-5 mr-3" />
                Réserver Maintenant
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="tel:+237675978777"
                className="group bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 text-center flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                (+237) 675 978 777
              </a>
            </div>

            {/* Trust Indicators Premium */}
            <div className="flex items-center justify-between pt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm opacity-80">Clients Satisfaits</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">4.9/5</div>
                <div className="text-sm opacity-80">Note Moyenne</div>
                <div className="text-xs opacity-70 mt-1">Google Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">24h</div>
                <div className="text-sm opacity-80">Service Urgence</div>
                <div className="text-xs opacity-70 mt-1">7j/7 disponible</div>
              </div>
            </div>

            {/* Location Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20">
              <MapPin className="h-4 w-4 mr-2 text-red-400" />
              Rue PAU, Akwa - En face AGROMAC
            </div>
          </div>

          <div className="hero-image space-y-8">
            {/* Main Image avec overlay premium */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <img 
                src="/294960445_557556392518988_5899854189761142977_n.jpg" 
                alt="Atelier IN AUTO - Garage professionnel Douala" 
                className="relative rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-500 border-4 border-white/20"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Overlay Info Premium */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    Pourquoi choisir IN AUTO ?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Équipe de techniciens certifiés et expérimentés</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Équipements de diagnostic dernière génération</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Tarifs transparents et compétitifs garantis</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Service client d'exception et suivi personnalisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards Premium */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400 mb-1">15min</div>
                <div className="text-sm opacity-80">Diagnostic Express</div>
                <div className="text-xs opacity-70 mt-1">Résultats immédiats</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/20">
                <div className="text-2xl font-bold text-green-400 mb-1">6 mois</div>
                <div className="text-sm opacity-80">Garantie Totale</div>
                <div className="text-xs opacity-70 mt-1">Pièces & main d'œuvre</div>
              </div>
            </div>

            {/* Services rapides */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold mb-4 text-center">Services Express Disponibles</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Vidange 30min</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span>Diagnostic 15min</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                  <span>Pneus 20min</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  <span>Freinage 45min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator Premium */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="tel:+237675978777"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
};

export default Hero;