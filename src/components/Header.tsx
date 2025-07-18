import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Wrench } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#services', label: 'Nos Services' },
    { href: '#about', label: 'À Propos' },
    { href: '#avis', label: 'Avis Clients' },
    { href: '#conseils', label: 'Conseils' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>(+237) 675 978 777</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Rue PAU, Akwa, Douala</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Lun-Sam: 8h00-18h00</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src="/438795906_1005039187770704_7882610973164968600_n.png" 
                  alt="IN AUTO Logo" 
                  className="h-12 w-auto"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/admin"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Admin
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Prendre RDV
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 py-4 border-t">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="block mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Prendre RDV
              </a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;