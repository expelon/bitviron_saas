
import React, { useState } from 'react';
import { Tool } from '../types';
import { summarizeText, cleanCode } from '../services/geminiService';
import { Loader2, X, Clipboard, Check } from 'lucide-react';

interface AIToolModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

const AIToolModal: React.FC<AIToolModalProps> = ({ tool, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      if (tool.id === 'text-summarizer') {
        const result = await summarizeText(input);
        setOutput(result);
      } else if (tool.id === 'case-converter') {
        // Local logic for simple tools
        setOutput(input.toUpperCase());
      } else if (tool.id === 'json-formatter') {
        try {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch (e) {
          setOutput("Invalid JSON input.");
        }
      } else if (tool.id === 'password-gen') {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let pass = "";
        for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        setOutput(pass);
      } else {
        setOutput(`Result for ${tool.name} will appear here.`);
      }
    } catch (error) {
      console.error(error);
      setOutput("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
              {tool.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{tool.name}</h2>
              <p className="text-sm text-slate-500">{tool.category} Utility</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Input Data</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm resize-none"
              placeholder={`Enter your ${tool.name === 'Safe Password' ? 'seed or preference' : 'data'} here...`}
            />
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleAction}
              disabled={loading || (tool.id !== 'password-gen' && !input.trim())}
              className="bg-blue-600 text-white font-bold px-12 py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Process Now'}
            </button>
          </div>

          {output && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Output</label>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>
              <div className="w-full p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {output}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
          Powered by Bitviron Core Engine & Google Gemini
        </div>
      </div>
    </div>
  );
};

export default AIToolModal;
