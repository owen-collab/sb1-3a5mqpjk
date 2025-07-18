import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, User, LogOut } from 'lucide-react';
import { AuthUser } from '../lib/auth';

interface HeaderProps {
  user: AuthUser | null;
  onShowAuth: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onShowAuth, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-black to-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
                    IN AUTO
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-red-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-red-50 hover:shadow-sm"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/admin"
                className="text-gray-700 hover:text-red-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-red-50 hover:shadow-sm"
              >
                Admin
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.profile?.nom || user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mon espace client
                      </Link>
                      <button
                        onClick={() => {
                          onSignOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={onShowAuth}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Connexion
                  </button>
                  <a
                    href="#contact"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Prendre RDV
                  </a>
                </div>
              )}
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
              
              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon espace client
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-700 hover:text-red-600 font-medium w-full text-left"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => {
                      onShowAuth();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium text-center transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Connexion
                  </button>
                  <a
                    href="#contact"
                    className="block mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Prendre RDV
                  </a>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;