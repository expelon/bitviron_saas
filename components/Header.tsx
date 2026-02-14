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

  const menuItems = [
    { label: 'Tools', href: '#' },
    { label: 'AI Tools', href: '#' },
    { label: 'Category', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'About Us', href: '#' },
  ];

  return (
    <header className={`absolute top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="grid grid-cols-2 gap-0.5 group-hover:rotate-180 transition-transform duration-700">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Bitviron</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button className="text-sm font-bold text-slate-900 border-2 border-slate-900/10 px-6 py-2.5 rounded-full hover:bg-slate-50 transition-all active:scale-95">
            Contact
          </button>
        </div>

        {/* Mobile Menu Button - Morphing Hamburger */}
        <div className="lg:hidden flex items-center z-[110]">
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex flex-col justify-center items-center group focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}></div>
            <div className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></div>
            <div className={`w-6 h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Premium Glassmorphism */}
      <div className={`lg:hidden fixed inset-0 z-[105] transition-all duration-500 overflow-hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop Blur Layer */}
        <div className={`absolute inset-0 bg-white/80 backdrop-blur-2xl transition-all duration-700 ${isMenuOpen ? 'scale-100' : 'scale-110'}`}></div>

        <div className="relative h-full flex flex-col px-8 pt-32 pb-12">
          <nav className="flex flex-col gap-8">
            {menuItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-4xl font-black text-slate-900 tracking-tighter hover:text-blue-600 transition-all transform duration-500 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}.
              </a>
            ))}
          </nav>

          <div className={`mt-auto space-y-4 transform transition-all duration-700 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-colors">
              Contact
            </button>
          </div>

          {/* Subtle decoration in mobile menu */}
          <div className="absolute bottom-10 right-10 text-[60px] font-black text-slate-900/5 rotate-12 pointer-events-none">
            BITVIRON.
          </div>
        </div>
      </div>

      <style jsx>{`
        header {
          position: absolute !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
