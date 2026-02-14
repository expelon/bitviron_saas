"use client";

import React, { useState } from 'react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Bitviron</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Solutions</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Resources</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">Sign in</button>
          <button className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            Get demo
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="p-2 text-slate-600 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl z-50 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 flex flex-col gap-6">
            <nav className="flex flex-col gap-6">
              <a href="#" className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#" className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Solutions</a>
              <a href="#" className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Resources</a>
              <a href="#" className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            </nav>
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <button className="w-full text-slate-900 font-bold py-3 text-center border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Sign in</button>
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">Get demo</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
