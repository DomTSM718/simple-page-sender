
import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl">
            The Solution Mob
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-white hover:text-gray-300 transition-colors">
              Services
            </a>
            <a href="#contact" className="text-white hover:text-gray-300 transition-colors">
              Contact
            </a>
            <a href="#contact" className="text-white hover:text-gray-300 transition-colors">
              Let's Talk
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
