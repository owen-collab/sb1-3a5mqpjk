import React from 'react';
import { Wrench, Zap, Wind, Shield, Car, Settings, Clock, CheckCircle, Star, Award, Phone } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Zap,
      title: 'Diagnostic Électronique',
      description: 'Diagnostic complet avec valise professionnelle dernière génération. Identification précise des pannes électroniques.',
      price: '15 000 FCFA',
      duration: '15-45 min',
      features: ['Lecture codes défaut', 'Test capteurs', 'Rapport détaillé', 'Conseils personnalisés'],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      icon: Settings,
      title: 'Vidange + Entretien',
      description: 'Vidange complète avec huile de qualité, changement des filtres et vérification des niveaux.',
      price: '35 000 FCFA',
      duration: '45 min',
      features: ['Huile moteur premium', 'Filtre à huile', 'Filtre à air', 'Vérification 20 points'],
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      icon: Wind,
      title: 'Climatisation',
      description: 'Entretien et réparation système de climatisation. Recharge gaz, nettoyage circuit.',
      price: '25 000 FCFA',
      duration: '60-90 min',
      features: ['Recharge gaz R134a', 'Nettoyage évaporateur', 'Test étanchéité', 'Désinfection circuit'],
      color: 'from-cyan-500 to-cyan-600',
      popular: false
    },
    {
      icon: Shield,
      title: 'Système de Freinage',
      description: 'Contrôle et réparation complète du système de freinage pour votre sécurité.',
      price: '45 000 FCFA',
      duration: '90 min',
      features: ['Plaquettes de frein', 'Disques de frein', 'Liquide de frein', 'Test performance'],
      color: 'from-red-500 to-red-600',
      popular: false
    },
    {
      icon: Car,
      title: 'Pneus + Géométrie',
      description: 'Montage, équilibrage et géométrie de précision pour une conduite optimale.',
      price: '15 000 FCFA',
      duration: '60 min',
      features: ['Montage pneus', 'Équilibrage roues', 'Géométrie 4 roues', 'Contrôle pression'],
      color: 'from-purple-500 to-purple-600',
      popular: false
    },
    {
      icon: Wrench,
      title: 'Révision Complète',
      description: 'Révision selon carnet constructeur avec contrôle de tous les organes vitaux.',
      price: '75 000 FCFA',
      duration: '2 heures',
      features: ['Contrôle 50 points', 'Vidange complète', 'Filtres multiples', 'Rapport détaillé'],
      color: 'from-orange-500 to-orange-600',
      popular: true
    }
  ];

  const guarantees = [
    {
      icon: Shield,
      title: 'Garantie 6 Mois',
      description: 'Toutes nos interventions sont garanties 6 mois pièces et main d\'œuvre'
    },
    {
      icon: Clock,
      title: 'Délais Respectés',
      description: 'Nous respectons scrupuleusement les délais annoncés'
    },
    {
      icon: Award,
      title: 'Pièces d\'Origine',
      description: 'Utilisation exclusive de pièces d\'origine ou équivalent constructeur'
    },
    {
      icon: CheckCircle,
      title: 'Devis Gratuit',
      description: 'Établissement gratuit de devis détaillé avant toute intervention'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <Wrench className="h-4 w-4 mr-2" />
            Nos Services
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Services
            <span className="block bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              Professionnels
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des services automobiles complets avec des techniciens certifiés, 
            des équipements de pointe et une garantie de satisfaction.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              {/* Badge Popular */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Populaire
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${service.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <service.icon className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Price and Duration */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold text-gray-800">{service.price}</div>
                      <div className="text-sm text-gray-500">Prix transparent</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{service.duration}</span>
                      </div>
                      <div className="text-xs text-gray-500">Durée estimée</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href="#contact"
                    className={`w-full bg-gradient-to-r ${service.color} hover:shadow-lg text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-center block group-hover:shadow-xl`}
                  >
                    Réserver ce Service
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Nos Engagements Qualité
            </h3>
            <p className="text-xl text-gray-600">
              Votre satisfaction et votre sécurité sont nos priorités absolues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <guarantee.icon className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">{guarantee.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Service */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-3xl p-8 lg:p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Phone className="h-10 w-10" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Service d'Urgence 24h/24
            </h3>
            <p className="text-xl opacity-90 mb-8">
              Panne sur route ? Problème urgent ? Notre équipe d'intervention rapide est disponible !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+237675978777"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="h-5 w-5 mr-3" />
                Appel d'Urgence : (+237) 675 978 777
              </a>
              <a
                href="#contact"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                Prendre Rendez-vous
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;