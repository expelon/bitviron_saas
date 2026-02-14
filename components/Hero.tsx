
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden mesh-bg">
      {/* Background Dots */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100/50">
             <div className="grid grid-cols-2 gap-1 p-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
             </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold text-slate-900 tracking-tight mb-6 relative z-10">
          One platform. <br />
          <span className="text-slate-400">Every digital tool.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 relative z-10">
          The ultimate utility engine for creators and developers. Convert, format, secure, and optimize your workflow in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto bg-blue-600 text-white text-lg font-bold px-10 py-4 rounded-xl shadow-2xl shadow-blue-300/50 hover:bg-blue-700 hover:scale-105 transition-all"
          >
            Explore Toolbox
          </button>
        </div>
      </div>

      {/* Floating Tool-Related Elements - Opacity reduced for subtle premium feel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Case Converter Tool Card (Top Left) */}
        <div className="absolute top-[12%] left-[-1rem] sm:left-4 lg:left-20 w-44 sm:w-56 p-4 sm:p-5 bg-white shadow-xl rounded-2xl border border-slate-100 transform -rotate-3 floating-element delay-1 scale-[0.6] sm:scale-75 lg:scale-100 opacity-20 sm:opacity-40 lg:opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">Aa</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Converter</span>
          </div>
          <div className="space-y-2">
            <div className="bg-slate-50 p-2 rounded-lg text-[10px] font-mono text-slate-400">inputText</div>
            <div className="bg-blue-600 p-2 rounded-lg text-[10px] font-mono text-white text-center font-bold">INPUT_TEXT</div>
          </div>
        </div>

        {/* Security / Password Key (Bottom Left) */}
        <div className="absolute top-[65%] left-[-1rem] sm:left-12 lg:left-32 w-14 h-14 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-xl sm:rounded-2xl flex items-center justify-center floating-element delay-2 border border-slate-100 scale-[0.7] sm:scale-100 opacity-15 sm:opacity-30 lg:opacity-40">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
        </div>

        {/* Developer / JSON Card (Hidden on Mobile) */}
        <div className="hidden md:block absolute bottom-12 left-[10%] lg:left-1/4 w-72 bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 border border-white floating-element delay-3 scale-75 lg:scale-100 opacity-30 lg:opacity-40">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-slate-900 text-sm">JSON Formatter</h4>
             <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">Valid</span>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl overflow-hidden">
            <pre className="text-[10px] font-mono leading-tight">
              <span className="text-purple-400">"status"</span>: <span className="text-emerald-400">"success"</span>,<br/>
              <span className="text-purple-400">"code"</span>: <span className="text-blue-400">200</span>,<br/>
              <span className="text-purple-400">"data"</span>: &#123; ... &#125;
            </pre>
          </div>
        </div>

        {/* Utility Engine / Tool Queue (Top Right) */}
        <div className="absolute top-[18%] right-[-4rem] sm:right-4 lg:right-20 w-64 sm:w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-50 floating-element delay-1 scale-[0.4] sm:scale-75 lg:scale-100 opacity-20 sm:opacity-35 lg:opacity-45 origin-top-right">
          <div className="flex items-center justify-between mb-5">
             <h4 className="font-bold text-slate-900 text-base">Active Utilities</h4>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-blue-600 text-[10px]">{}</span></div>
                 <span className="text-xs font-bold text-slate-700">JSON Prettify</span>
               </div>
               <span className="text-[10px] font-bold text-emerald-600">Done</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><span className="text-orange-600 text-[10px]">#</span></div>
                 <span className="text-xs font-bold text-slate-700">SHA-256 Hash</span>
               </div>
               <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-orange-400 w-3/4"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Speed / Optimization Indicator (Bottom Right) */}
        <div className="hidden sm:block absolute bottom-[15%] right-2 sm:right-10 lg:right-32 w-48 bg-white shadow-2xl rounded-3xl p-6 border border-slate-100 floating-element delay-2 scale-75 lg:scale-100 origin-bottom-right opacity-25 sm:opacity-40 lg:opacity-50">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900 mb-1">0.4<span className="text-blue-600 text-sm">ms</span></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Speed</div>
            <div className="mt-4 flex gap-1 justify-center">
              {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-4 rounded-full ${i < 5 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
