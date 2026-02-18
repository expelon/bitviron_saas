"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
    Cpu,
    FileText
} from 'lucide-react';

// Tool data mapped from internal constants but formatted for premium showcase
const tools = [
    {
        id: 'pdf-merger',
        name: 'Merge PDF',
        description: 'Orchestrate multiple PDF data streams into a singular, unified document structure.',
        tag: 'DOCUMENT CORE',
        icon: <FileText className="w-8 h-8 text-red-600" />,
        version: 'v4.4',
        href: '/tools/pdf-merger'
    },
    {
        id: 'pdf-split',
        name: 'Split PDF',
        description: 'Extract specific pages or split documents into separate PDF files with precision.',
        tag: 'DOCUMENT CORE',
        icon: <Scissors className="w-8 h-8 text-orange-600" />,
        version: 'v1.4',
        href: '/tools/pdf-split'
    }
];

export default function ToolsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = tools.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black selection:bg-black selection:text-white pt-32 pb-40 px-6 md:px-12 w-full overflow-x-hidden">

            <div className="max-w-[1600px] mx-auto">

                {/* Editorial Hero */}
                <div className="grid grid-cols-12 gap-8 mb-32 border-b border-black pb-12 items-end">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-12 h-[1px] bg-black"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Precision Utilities // {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-6xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase text-black">
                            Bitviron<br />Utility Core.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right">
                        <div className="max-w-xs space-y-6">
                            <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase font-mono">
                                [ System utilities ]<br />
                                High-performance modules engineered for professional-grade document and data orchestration.
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

                            <div className="pt-12 text-black">
                                <Link href={product.href} className="flex items-center gap-4 group/btn inline-flex">
                                    <span className="text-xs font-bold uppercase tracking-widest border-b border-transparent group-hover/btn:border-black transition-all">
                                        Open Tool
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all duration-300 transform group-hover/btn:rotate-45">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Footer Decoration */}
                <div className="mt-40 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 select-none pointer-events-none font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex gap-12">
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> System: Stable</span>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Encryption: AES-256</span>
                    </div>
                    <span>Bitviron Core © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 4ms</span>
                        <span>Active Modules: {tools.length}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
