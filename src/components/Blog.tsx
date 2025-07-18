import React from 'react';
import { useState } from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const blogPosts = [
    {
      id: 1,
      title: "Les 5 signes qu'il est temps de changer vos pneus",
      excerpt: "Découvrez comment identifier quand vos pneus ont besoin d'être remplacés pour votre sécurité.",
      fullContent: `
        <h3>1. Usure de la bande de roulement</h3>
        <p>La profondeur de la bande de roulement doit être d'au moins 1,6 mm. Utilisez une pièce de monnaie pour vérifier : si vous voyez complètement la tête sur la pièce, il est temps de changer vos pneus.</p>
        
        <h3>2. Fissures sur les flancs</h3>
        <p>Des fissures visibles sur les côtés du pneu indiquent un vieillissement du caoutchouc. Ces fissures peuvent provoquer des éclatements dangereux.</p>
        
        <h3>3. Déformation ou bosses</h3>
        <p>Des bosses ou déformations sur le pneu signalent des dommages internes. Ces défauts compromettent la sécurité et l'adhérence.</p>
        
        <h3>4. Vibrations anormales</h3>
        <p>Si votre véhicule vibre de manière inhabituelle, cela peut indiquer un problème d'équilibrage ou un pneu endommagé.</p>
        
        <h3>5. Âge du pneu</h3>
        <p>Même peu utilisés, les pneus doivent être remplacés après 6-10 ans selon les conditions de stockage et d'utilisation.</p>
        
        <p><strong>Chez IN AUTO, nous proposons :</strong></p>
        <ul>
          <li>Diagnostic gratuit de vos pneus</li>
          <li>Large gamme de pneus toutes marques</li>
          <li>Montage et équilibrage professionnel</li>
          <li>Géométrie de précision</li>
          <li>Conseils personnalisés selon votre conduite</li>
        </ul>
      `,
      image: "/101533631_103514974727319_4043303090290425856_n.jpg",
      date: "15 Mars 2024",
      author: "Expert Auto",
      category: "Sécurité",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Entretien hivernal : préparez votre véhicule",
      excerpt: "Guide complet pour préparer votre voiture aux conditions hivernales difficiles.",
      fullContent: `
        <h3>Vérification de la batterie</h3>
        <p>Le froid réduit la capacité de la batterie de 20 à 50%. Vérifiez les bornes, nettoyez-les et testez la charge. Une batterie faible en hiver peut vous laisser en panne.</p>
        
        <h3>Système de refroidissement</h3>
        <p>Vérifiez le niveau et la concentration de l'antigel. Un mélange 50/50 eau-antigel protège jusqu'à -37°C. Inspectez les durites pour détecter les fuites.</p>
        
        <h3>Huile moteur</h3>
        <p>Utilisez une huile adaptée aux basses températures. Une huile 5W-30 ou 0W-30 facilite les démarrages à froid et protège mieux le moteur.</p>
        
        <h3>Pneus hiver</h3>
        <p>En dessous de 7°C, les pneus hiver offrent une meilleure adhérence. Vérifiez la pression régulièrement car elle baisse avec le froid.</p>
        
        <h3>Éclairage et visibilité</h3>
        <p>Vérifiez tous les feux, remplacez les balais d'essuie-glaces et utilisez un lave-glace antigel.</p>
        
        <p><strong>Notre service hivernal chez IN AUTO :</strong></p>
        <ul>
          <li>Contrôle batterie et alternateur</li>
          <li>Test antigel et système de refroidissement</li>
          <li>Vidange avec huile adaptée</li>
          <li>Montage pneus hiver</li>
          <li>Vérification complète éclairage</li>
        </ul>
      `,
      image: "/IMG-20250708-WA0007.jpg",
      date: "10 Mars 2024",
      author: "Mécanicien Pro",
      category: "Entretien",
      readTime: "7 min"
    },
    {
      id: 3,
      title: "Économisez sur l'entretien de votre voiture",
      excerpt: "Astuces et conseils pour réduire les coûts d'entretien sans compromettre la qualité.",
      fullContent: `
        <h3>Entretien préventif</h3>
        <p>Un entretien régulier coûte moins cher que les réparations d'urgence. Respectez les intervalles de vidange et les révisions programmées.</p>
        
        <h3>Conduite économique</h3>
        <p>Une conduite souple réduit l'usure : évitez les accélérations brutales, anticipez les freinages, maintenez une vitesse constante.</p>
        
        <h3>Vérifications régulières</h3>
        <p>Contrôlez mensuellement : pression des pneus, niveaux (huile, liquide de frein, lave-glace), état des balais d'essuie-glaces.</p>
        
        <h3>Choisir les bonnes pièces</h3>
        <p>Les pièces d'origine ou équivalent constructeur durent plus longtemps. Un prix plus élevé à l'achat peut être plus économique à long terme.</p>
        
        <h3>Garage de confiance</h3>
        <p>Un garage transparent sur ses tarifs et ses interventions vous évite les mauvaises surprises et les réparations inutiles.</p>
        
        <h3>Nos conseils économiques :</h3>
        <ul>
          <li>Forfaits entretien avantageux</li>
          <li>Diagnostic gratuit avant intervention</li>
          <li>Devis détaillé et transparent</li>
          <li>Pièces garanties 6 mois</li>
          <li>Conseils personnalisés pour optimiser vos coûts</li>
        </ul>
        
        <p><strong>Économisez jusqu'à 30% sur vos frais d'entretien avec nos forfaits annuels !</strong></p>
      `,
      image: "/IMG-20250708-WA0029.jpg",
      date: "5 Mars 2024",
      author: "Conseiller Auto",
      category: "Économie",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Maintenance préventive : la clé de la longévité",
      excerpt: "Découvrez l'importance de la maintenance préventive pour prolonger la vie de votre véhicule.",
      fullContent: `
        <h3>Qu'est-ce que la maintenance préventive ?</h3>
        <p>C'est l'ensemble des interventions programmées pour éviter les pannes et maintenir les performances de votre véhicule.</p>
        
        <h3>Les avantages</h3>
        <ul>
          <li>Réduction des pannes imprévues de 80%</li>
          <li>Économies sur les réparations majeures</li>
          <li>Maintien de la valeur de revente</li>
          <li>Sécurité optimale</li>
          <li>Consommation maîtrisée</li>
        </ul>
        
        <h3>Planning de maintenance</h3>
        <p><strong>Tous les 5 000 km :</strong> Vidange, filtres, vérifications de base</p>
        <p><strong>Tous les 10 000 km :</strong> Contrôle freinage, suspension, échappement</p>
        <p><strong>Tous les 20 000 km :</strong> Révision complète, distribution si nécessaire</p>
        
        <h3>Notre approche chez IN AUTO</h3>
        <p>Nous établissons un carnet de suivi personnalisé et vous rappelons les échéances importantes.</p>
      `,
      image: "/477255297_1218926753048612_1400709284416765383_n.jpg",
      date: "1 Mars 2024",
      author: "Technicien Expert",
      category: "Maintenance",
      readTime: "8 min"
    },
    {
      id: 5,
      title: "Diagnostic moderne : technologie au service de votre auto",
      excerpt: "Comment nos équipements de diagnostic dernière génération révolutionnent l'entretien automobile.",
      fullContent: `
        <h3>Diagnostic électronique avancé</h3>
        <p>Nos valises de diagnostic dernière génération analysent plus de 50 systèmes de votre véhicule en temps réel.</p>
        
        <h3>Détection précoce</h3>
        <p>Identification des problèmes avant qu'ils ne deviennent critiques, permettant des interventions préventives économiques.</p>
        
        <h3>Précision maximale</h3>
        <p>Localisation exacte des défauts, réduisant le temps de réparation et les coûts de main d'œuvre.</p>
        
        <h3>Rapport détaillé</h3>
        <p>Vous recevez un rapport complet avec photos et explications claires des interventions nécessaires.</p>
        
        <h3>Technologies utilisées :</h3>
        <ul>
          <li>Diagnostic OBD multi-marques</li>
          <li>Analyse des systèmes hybrides</li>
          <li>Test des capteurs et actuateurs</li>
          <li>Programmation et codage</li>
          <li>Mise à jour des calculateurs</li>
        </ul>
      `,
      image: "/IMG-20250708-WA0029.jpg",
      date: "25 Février 2024",
      author: "Ingénieur Auto",
      category: "Technologie",
      readTime: "5 min"
    },
    {
      id: 6,
      title: "Atelier moderne : un environnement professionnel",
      excerpt: "Découvrez notre atelier équipé des dernières technologies pour un service de qualité.",
      fullContent: `
        <h3>Équipements de pointe</h3>
        <p>Notre atelier dispose des derniers équipements : ponts élévateurs, banc de géométrie 3D, station de climatisation.</p>
        
        <h3>Environnement propre et organisé</h3>
        <p>Un atelier propre garantit un travail de qualité et évite les contaminations qui pourraient endommager votre véhicule.</p>
        
        <h3>Sécurité maximale</h3>
        <p>Respect des normes de sécurité les plus strictes pour protéger votre véhicule et nos techniciens.</p>
        
        <h3>Traçabilité complète</h3>
        <p>Chaque intervention est documentée et tracée pour un suivi optimal de l'historique de votre véhicule.</p>
        
        <h3>Notre atelier en chiffres :</h3>
        <ul>
          <li>300m² d'espace de travail</li>
          <li>6 postes de travail équipés</li>
          <li>Outillage professionnel renouvelé</li>
          <li>Zone de stockage climatisée</li>
          <li>Espace client confortable</li>
        </ul>
      `,
      image: "/IMG-20250708-WA0003.jpg",
      date: "20 Février 2024",
      author: "Direction IN AUTO",
      category: "Atelier",
      readTime: "4 min"
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
      case 'Maintenance':
        return 'bg-purple-100 text-purple-800';
      case 'Technologie':
        return 'bg-blue-100 text-blue-800';
      case 'Atelier':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReadMore = (postId: number) => {
    setSelectedArticle(postId);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };
  return (
    <>
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

                <button 
                  onClick={() => handleReadMore(post.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
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
      {/* Modal pour l'article complet */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const article = blogPosts.find(post => post.id === selectedArticle);
              if (!article) return null;
              
              return (
                <>
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={handleCloseArticle}
                      className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{article.date}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-4">{article.readTime}</span>
                      <User className="w-4 h-4 mr-1" />
                      <span>{article.author}</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-black mb-6">
                      {article.title}
                    </h1>
                    
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: article.fullContent }}
                    />
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-red-800 mb-2">
                          Besoin d'aide pour votre véhicule ?
                        </h3>
                        <p className="text-red-700 mb-4">
                          Notre équipe d'experts est à votre disposition pour tous vos besoins d'entretien et de réparation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href="#contact"
                            onClick={handleCloseArticle}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-center"
                          >
                            Prendre rendez-vous
                          </a>
                          <a
                            href="tel:+237675978777"
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-center"
                          >
                            Appeler maintenant
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;