import React from 'react';
import { Users, Car, Award, Calendar, TrendingUp } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Calendar,
      number: '5+',
      label: 'Années d\'Expérience',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'De service d\'excellence'
    },
    {
      icon: Car,
      number: '1000+',
      label: 'Véhicules Entretenus',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      description: 'Toutes marques confondues'
    },
    {
      icon: Users,
      number: '500+',
      label: 'Clients Satisfaits',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Qui nous font confiance'
    },
    {
      icon: Award,
      number: '20+',
      label: 'Marques Spécialisées',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      description: 'Expertise multi-marques'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Nos Performances
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Des Chiffres qui Parlent
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre expertise et notre engagement se reflètent dans nos résultats exceptionnels
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                
                {/* Number */}
                <div className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>

                {/* Hover Effect */}
                <div className={`h-1 w-0 ${stat.color === 'text-blue-600' ? 'bg-blue-600' : 'bg-red-500'} rounded-full mt-4 group-hover:w-full transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Rejoignez nos clients satisfaits !
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Découvrez pourquoi plus de 500 clients nous font confiance pour l'entretien de leur véhicule
            </p>
            <a
              href="#contact"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
            >
              Prendre Rendez-vous
              <Award className="h-5 w-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;