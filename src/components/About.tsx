import React from 'react';
import { Star, Handshake, Wrench, Heart, Award, Users, Clock, Shield } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Star,
      title: 'Excellence',
      description: 'Qualité irréprochable dans chaque intervention',
      color: 'text-red-500'
    },
    {
      icon: Handshake,
      title: 'Confiance',
      description: 'Transparence totale et conseils honnêtes',
      color: 'text-black'
    },
    {
      icon: Wrench,
      title: 'Expertise',
      description: 'Techniciens certifiés et équipements modernes',
      color: 'text-red-500'
    },
    {
      icon: Heart,
      title: 'Service',
      description: 'Accueil chaleureux et suivi personnalisé',
      color: 'text-red-500'
    }
  ];

  const certifications = [
    { name: 'Diagnostic Électronique', level: 'Certifié' },
    { name: 'Climatisation Auto', level: 'Spécialiste' },
    { name: 'Géométrie de Précision', level: 'Expert' },
    { name: 'Mécanique Générale', level: 'Maître' }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              À Propos d'IN AUTO - Plus qu'un garage, une passion
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Depuis notre création à Douala, IN AUTO s'est imposé comme une référence incontournable 
              dans le secteur de l'automobile camerounais. Situé stratégiquement rue PAU à Akwa, 
              en face d'AGROMAC, notre garage moderne allie tradition artisanale et innovation technologique.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Notre équipe de techniciens qualifiés et certifiés met son expertise au service de votre véhicule, 
              qu'il s'agisse d'un entretien courant, d'une réparation complexe ou d'un diagnostic approfondi. 
              Nous travaillons sur toutes les marques et modèles avec un engagement inébranlable : 
              la qualité, la transparence et votre satisfaction.
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-semibold">Garage Certifié</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-black mr-2" />
                <span className="text-sm font-semibold">Équipe Qualifiée</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-semibold">Garantie 6 Mois</span>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="/438795906_1005039187770704_7882610973164968600_n.png" 
              alt="Équipe IN AUTO - Garage professionnel Douala" 
              className="rounded-lg shadow-lg w-full h-64 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Valeurs */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Nos Valeurs Fondamentales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${value.color}`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Certifications & Expertise
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-red-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{cert.name}</h4>
                <p className="text-sm text-red-600 font-medium">{cert.level}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Témoignage du dirigeant */}
        <div className="mt-16 bg-gradient-to-r from-black to-red-600 text-white rounded-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10" />
            </div>
            <blockquote className="text-xl italic mb-6">
              "Notre mission est simple : offrir à chaque client le meilleur service possible, 
              avec la transparence et l'expertise qu'il mérite. Chaque véhicule qui entre dans notre atelier 
              est traité avec le même soin que si c'était le nôtre."
            </blockquote>
            <div className="text-lg font-semibold">
              Direction IN AUTO
            </div>
            <div className="text-sm opacity-90">
              Garage Professionnel Douala
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;