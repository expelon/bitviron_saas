
import React from 'react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
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

        <nav className="hidden md:flex items-center gap-10">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Solutions</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Resources</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">Sign in</button>
          <button className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            Get demo
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
