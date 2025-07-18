import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Jean-Paul Kouam',
      role: 'Directeur d\'entreprise',
      rating: 5,
      comment: 'Service exceptionnel ! L\'équipe d\'IN AUTO a diagnostiqué et réparé une panne complexe que d\'autres garages n\'arrivaient pas à résoudre. Transparence totale sur les prix et délais respectés. Je recommande vivement !',
      image: '/101533631_103514974727319_4043303090290425856_n.jpg'
    },
    {
      name: 'Marie Ngono',
      role: 'Enseignante',
      rating: 5,
      comment: 'Enfin un garage qui prend le temps d\'expliquer ! Ils m\'ont montré exactement ce qui n\'allait pas avec photos à l\'appui. Travail impeccable et garantie respectée. Mon véhicule n\'a jamais été aussi bien entretenu.',
      image: '/294960445_557556392518988_5899854189761142977_n.jpg'
    },
    {
      name: 'Paul Mballa',
      role: 'Cadre commercial',
      rating: 5,
      comment: 'Équipe très professionnelle et accueillante. Ils ont réparé ma climatisation en moins de 2 heures et à un prix très raisonnable. L\'atelier est propre et bien équipé. Je reviendrai certainement !',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2'
    },
    {
      name: 'Brigitte Fosso',
      role: 'Gérante de flotte',
      rating: 5,
      comment: 'Service de qualité pour mes véhicules de société. Ils gèrent parfaitement ma flotte de 5 véhicules avec des tarifs préférentiels et un suivi rigoureux. Facturation claire et interventions rapides.',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2'
    },
    {
      name: 'Michel Biya',
      role: 'Chauffeur professionnel',
      rating: 5,
      comment: 'Excellent service ! Diagnostic précis et réparation rapide. L\'équipe est très compétente et honnête. Ils m\'ont évité une réparation coûteuse inutile. Merci pour votre professionnalisme.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2'
    },
    {
      name: 'Célestine Momo',
      role: 'Fonctionnaire',
      rating: 5,
      comment: 'Je suis cliente depuis 3 ans et je n\'ai jamais été déçue. Service client exceptionnel, conseils avisés et tarifs justes. IN AUTO est devenu mon garage de confiance à Douala.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="avis" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ce que nos clients disent de nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfaction de nos clients est notre plus belle récompense. 
            Découvrez leurs témoignages authentiques.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-blue-900 opacity-20 mr-2" />
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-gray-200">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques de satisfaction */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Satisfaction Client
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-900 mb-2">98%</div>
              <div className="text-gray-600">Clients Satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Note Moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-gray-600">Clients Fidèles</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-blue-900 text-white rounded-lg p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">Rejoignez nos clients satisfaits</h3>
            <p className="mb-6 opacity-90">
              Faites confiance à IN AUTO pour l'entretien de votre véhicule
            </p>
            <a
              href="#contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-block"
            >
              Prendre Rendez-vous
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;