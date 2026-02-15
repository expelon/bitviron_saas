"use client";

import React, { useState } from 'react';
import {
    ArrowUpRight,
    Search,
    ChevronRight,
    Sparkles,
    CaseUpper,
    FileJson,
    Hash,
    ShieldCheck,
    Scissors,
    MousePointer2,
    Terminal,
    Cpu
} from 'lucide-react';

// Tool data mapped from internal constants but formatted for premium showcase
const products = [
    {
        id: 'ai-summarizer',
        name: 'Bitviron Intelligence',
        description: 'Advanced neural processing for real-time text summarization and semantic analysis.',
        tag: 'AI ENGINE',
        icon: <Sparkles className="w-8 h-8 text-blue-600" />,
        version: 'v2.1'
    },
    {
        id: 'json-formatter',
        name: 'Bitviron Developer Kit',
        description: 'High-performance JSON orchestration, validation, and schema optimization.',
        tag: 'SYSTEM CORE',
        icon: <FileJson className="w-8 h-8 text-black" />,
        version: 'v1.4'
    },
    {
        id: 'password-gen',
        name: 'Bitviron Vault',
        description: 'Cryptographically secure entropy generation for high-level asset protection.',
        tag: 'SECURITY',
        icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
        version: 'v3.0'
    },
    {
        id: 'case-converter',
        name: 'Bitviron Text Engine',
        description: 'Precision typography and string manipulation for rapid content formatting.',
        tag: 'UTILITY',
        icon: <CaseUpper className="w-8 h-8 text-orange-600" />,
        version: 'v1.2'
    },
    {
        id: 'svg-optimizer',
        name: 'Bitviron Graphics SDK',
        description: 'Lossless vector optimization and geometric simplification for web assets.',
        tag: 'VISUAL',
        icon: <Scissors className="w-8 h-8 text-pink-600" />,
        version: 'v2.5'
    },
    {
        id: 'url-encoder',
        name: 'Bitviron Network Tools',
        description: 'Safe transport encoding for complex URI structures and API integration.',
        tag: 'PROTOCOL',
        icon: <Hash className="w-8 h-8 text-purple-600" />,
        version: 'v1.1'
    }
];

export default function ToolsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] selection:bg-black selection:text-white pt-32 pb-40 px-6 md:px-12 w-full overflow-x-hidden">

            <div className="max-w-[1600px] mx-auto">

                {/* Editorial Hero */}
                <div className="grid grid-cols-12 gap-8 mb-32 border-b border-black pb-12 items-end">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-black"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Precision Utilities</span>
                        </div>
                        <h1 className="text-6xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase">
                            The Bitviron<br />Product Suite.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right">
                        <div className="max-w-xs space-y-6">
                            <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase font-mono">
                                [ Native ecosystem ]<br />
                                High-performance modules engineered for professional-grade workflows.
                            </p>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Query system..."
                                    className="w-full bg-transparent border-b border-black py-2 pr-10 text-sm font-mono uppercase focus:outline-none placeholder:text-slate-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Showcase Table/Grid Hybrid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {filtered.map((product, idx) => (
                        <div key={product.id} className="group flex flex-col justify-between h-full border-l border-slate-100 pl-8 relative">

                            {/* Vertical indexing */}
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-slate-200 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100">
                                        <div className="transition-colors duration-500">
                                            {product.icon}
                                        </div>
                                    </div>
                                    <span className="font-mono text-[10px] text-slate-300">0{idx + 1} // {product.version}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase font-mono">
                                            {product.tag}
                                        </span>
                                        <h3 className="text-3xl font-bold tracking-tight text-slate-900 group-hover:translate-x-2 transition-transform duration-500">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-12">
                                <button className="flex items-center gap-4 group/btn">
                                    <span className="text-xs font-bold uppercase tracking-widest border-b border-transparent group-hover/btn:border-black transition-all">
                                        Launch Module
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all duration-300 transform group-hover/btn:rotate-45">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Footer Decoration */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Core: Active</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Status: Verified</span>
                    </div>
                    <span>Bitviron Multi-Tool Ecosystem © 2024</span>
                    <div className="flex gap-12">
                        <span>Latency: 12ms</span>
                        <span>Uptime: 99.9%</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
