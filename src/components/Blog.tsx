import React from 'react';
import { Calendar, User, ArrowRight, Car, Wrench, AlertTriangle } from 'lucide-react';

const Blog: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: 'Pourquoi l\'entretien régulier à Douala est-il crucial ?',
      excerpt: 'Découvrez pourquoi le climat équatorial et les conditions de conduite à Douala nécessitent un entretien plus fréquent et adapté de votre véhicule pour éviter les pannes coûteuses.',
      image: 'https://images.pexels.com/photos/3807300/pexels-photo-3807300.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      date: '15 Janvier 2025',
      author: 'Expert IN AUTO',
      category: 'Entretien',
      icon: Car,
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Les 5 signes d\'usure de vos pneus à surveiller',
      excerpt: 'Apprenez à identifier les signes d\'usure de vos pneus pour rouler en sécurité sur les routes camerounaises. Guide pratique avec photos et conseils d\'experts.',
      image: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      date: '12 Janvier 2025',
      author: 'Expert IN AUTO',
      category: 'Sécurité',
      icon: AlertTriangle,
      readTime: '4 min'
    },
    {
      id: 3,
      title: 'Comment lire les inscriptions sur un pneu ?',
      excerpt: 'Guide complet pour comprendre toutes les informations inscrites sur vos pneus : dimensions, indices de charge, vitesse, date de fabrication et plus encore.',
      image: 'https://images.pexels.com/photos/2290070/pexels-photo-2290070.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      date: '8 Janvier 2025',
      author: 'Expert IN AUTO',
      category: 'Guide',
      icon: Wrench,
      readTime: '3 min'
    }
  ];

  const tips = [
    {
      title: 'Contrôlez votre huile moteur',
      description: 'Vérifiez le niveau d\'huile au moins une fois par mois'
    },
    {
      title: 'Surveillez vos pneus',
      description: 'Contrôlez la pression et l\'usure régulièrement'
    },
    {
      title: 'Entretenez votre climatisation',
      description: 'Faites réviser votre clim avant la saison chaude'
    },
    {
      title: 'Écoutez votre véhicule',
      description: 'Tout bruit anormal mérite une vérification'
    }
  ];

  return (
    <section id="conseils" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nos Conseils Auto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profitez de l'expertise de nos techniciens avec nos guides pratiques 
            et conseils adaptés au contexte camerounais.
          </p>
        </div>

        {/* Articles de blog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-900 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{article.date}</span>
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{article.author}</span>
                  <span>• {article.readTime}</span>
                </div>
                <button className="text-blue-900 hover:text-blue-700 font-semibold flex items-center transition-colors">
                  Lire la suite
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Conseils rapides */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Conseils Rapides de nos Experts
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center mb-4 text-lg font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-black to-red-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Restez informé de nos derniers conseils
          </h3>
          <p className="mb-6 opacity-90">
            Recevez nos conseils d'entretien et nos promotions directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 border-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;