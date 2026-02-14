
import React from 'react';

const FeatureSection: React.FC = () => {
  return (
    <section className="bg-white py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[120px] md:text-[240px] font-black text-slate-900 leading-[0.85] tracking-tighter mb-16 opacity-[0.05] absolute top-12 left-6 pointer-events-none uppercase">
          BITVIRON.
        </h2>
        
        <div className="relative z-10">
          <h2 className="text-[100px] md:text-[180px] font-black text-slate-900 leading-[0.8] tracking-tighter mb-20 uppercase">
            BITVIRON.
          </h2>
          
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-4 order-2 md:order-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex -space-x-4">
                  <img src="https://picsum.photos/id/64/100/100" className="w-12 h-12 rounded-full border-4 border-white" />
                  <img src="https://picsum.photos/id/65/100/100" className="w-12 h-12 rounded-full border-4 border-white" />
                  <img src="https://picsum.photos/id/66/100/100" className="w-12 h-12 rounded-full border-4 border-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">2M+</div>
                  <div className="text-sm text-slate-500 font-medium">World active user</div>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl font-medium text-slate-900 leading-tight border-b-2 border-slate-900 border-dotted pb-6">
                The utility platform that keeps your flow with professional tools and built-in automation.
              </p>
            </div>
            
            <div className="md:col-span-4 flex justify-center order-1 md:order-2">
              <div className="relative w-full aspect-square max-w-md">
                {/* 3D Abstract Shape Simulation (Using CSS gradients and shadows) */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full shadow-2xl overflow-hidden animate-pulse">
                  <div className="absolute top-0 left-0 w-full h-full bg-[#D2FF00]/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-blue-600/30 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4"></div>
                  <div className="absolute inset-4 border-[20px] border-white/20 rounded-full"></div>
                </div>
                
                {/* Floating Lime Circle */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#D2FF00] rounded-full flex flex-col items-center justify-center p-8 cursor-pointer group hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-slate-900 border-b-[10px] border-b-transparent ml-1"></div>
                  <div className="text-slate-900 font-bold text-center text-sm mt-2 leading-none">How it works?</div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4 flex flex-col gap-6 items-end text-right order-3">
              <div className="flex items-center gap-4 group cursor-default">
                <span className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">Web based</span>
                <span className="text-slate-300 font-mono">/01</span>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                <span className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">Collaborative</span>
                <span className="text-slate-300 font-mono">/02</span>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                <span className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">Real-time</span>
                <span className="text-slate-300 font-mono">/03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
