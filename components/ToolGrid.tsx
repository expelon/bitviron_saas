
import React from 'react';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface ToolGridProps {
  onToolSelect: (tool: Tool) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ onToolSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {TOOLS.map((tool) => (
        <div 
          key={tool.id} 
          onClick={() => onToolSelect(tool)}
          className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all cursor-pointer overflow-hidden relative"
        >
          {/* Decorative background element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors -z-10"></div>
          
          <div className="mb-6 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
            {tool.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          
          <p className="text-slate-500 leading-relaxed mb-8">
            {tool.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
              {tool.category} Utility
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300">
              <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolGrid;
