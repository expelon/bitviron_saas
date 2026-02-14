
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Bitviron</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Your complete digital tools solution platform designed to simplify everyday online tasks.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tools Library</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">AI Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Carrers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="col-span-2">
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Newsletter</h5>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors w-full"
              />
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                Join
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-tight">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-400 font-medium">
            © 2024 Bitviron Platform. All rights reserved.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">Twitter</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">GitHub</a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">Dribbble</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
