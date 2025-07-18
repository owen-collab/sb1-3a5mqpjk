import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/438795906_1005039187770704_7882610973164968600_n.png" 
                alt="IN AUTO Logo" 
                className="h-16 w-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire automobile de confiance à Douala. 
              Expertise, transparence et service client d'exception depuis notre création.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nos Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Diagnostic Électronique</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Entretien Mécanique</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Pneus & Géométrie</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Climatisation</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Freinage</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Système Électrique</a></li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Utiles</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#accueil" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">À Propos</a></li>
              <li><a href="#avis" className="hover:text-white transition-colors">Avis Clients</a></li>
              <li><a href="#conseils" className="hover:text-white transition-colors">Conseils Auto</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-400" />
                <div>
                  <p>Rue PAU, Akwa</p>
                  <p>En face AGROMAC</p>
                  <p>Douala, Cameroun</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-red-400" />
                <a href="tel:+237675978777" className="hover:text-white transition-colors">
                  (+237) 675 978 777
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <a href="mailto:infos@inauto.fr" className="hover:text-white transition-colors">
                  infos@inauto.fr
                </a>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-red-400" />
                <div>
                  <p>Lun-Sam: 8h00-18h00</p>
                  <p className="text-sm">Urgences: 24h/24</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications et marques */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center mb-8">
            <h4 className="text-lg font-semibold mb-4">Marques Partenaires</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <span className="text-sm">NISSAN</span>
              <span className="text-sm">MICHELIN</span>
              <span className="text-sm">MERCEDES</span>
              <span className="text-sm">BOSCH</span>
              <span className="text-sm">BMW</span>
              <span className="text-sm">MITSUBISHI</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 IN AUTO. Tous droits réservés.</p>
          <p className="text-sm mt-2">
            Garage automobile professionnel à Douala - Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;