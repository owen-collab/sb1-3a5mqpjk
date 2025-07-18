import React from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Les 5 signes qu'il est temps de changer vos pneus",
      excerpt: "Découvrez comment identifier quand vos pneus ont besoin d'être remplacés pour votre sécurité.",
      image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "15 Mars 2024",
      author: "Expert Auto",
      category: "Sécurité",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Entretien hivernal : préparez votre véhicule",
      excerpt: "Guide complet pour préparer votre voiture aux conditions hivernales difficiles.",
      image: "https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "10 Mars 2024",
      author: "Mécanicien Pro",
      category: "Entretien",
      readTime: "7 min"
    },
    {
      id: 3,
      title: "Économisez sur l'entretien de votre voiture",
      excerpt: "Astuces et conseils pour réduire les coûts d'entretien sans compromettre la qualité.",
      image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "5 Mars 2024",
      author: "Conseiller Auto",
      category: "Économie",
      readTime: "6 min"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sécurité':
        return 'bg-red-100 text-red-800';
      case 'Entretien':
        return 'bg-gray-100 text-gray-800';
      case 'Économie':
        return 'bg-black text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            Conseils & Actualités
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Restez informé avec nos derniers articles sur l'entretien automobile, 
            les conseils de sécurité et les tendances du secteur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.date}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.readTime}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{post.author}</span>
                </div>

                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
                  Lire la suite
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Voir tous les articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;