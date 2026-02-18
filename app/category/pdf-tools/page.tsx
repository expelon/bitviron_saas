"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowUpRight,
    Search,
    Files,
    Scissors,
    Minimize2,
    FileText,
    FileType2,
    Unlock,
    Image as ImageIcon,
    Cpu,
    Terminal,
    Layers,
    FileImage
} from 'lucide-react';

// PDF Tool data
const pdfTools = [
    {
        id: 'merge-pdf',
        name: 'Merge PDF',
        description: 'Combine multiple PDF documents into a single, organized file.',
        tag: 'ORGANIZATION',
        icon: <Files className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" />,
        version: 'v2.1'
    },
    {
        id: 'split-pdf',
        name: 'Split PDF',
        description: 'Extract specific pages or split documents into separate PDF files.',
        tag: 'EXTRACTION',
        icon: <Scissors className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-500" />,
        version: 'v1.4'
    },
    {
        id: 'compress-pdf',
        name: 'Compress PDF',
        description: 'Reduce PDF file size with three precision compression presets.',
        tag: 'OPTIMIZATION',
        icon: <Minimize2 className="w-8 h-8 text-violet-600 group-hover:text-white transition-colors duration-500" />,
        version: 'v1.0'
    },
    {
        id: 'pdf-to-jpg',
        name: 'PDF to JPG',
        description: 'Convert every PDF page into a high-quality JPG image with instant preview and ZIP download.',
        tag: 'CONVERSION',
        icon: <ImageIcon className="w-8 h-8 text-amber-500 group-hover:text-white transition-colors duration-500" />,
        version: 'v1.0'
    },
    {
        id: 'jpg-to-pdf',
        name: 'JPG to PDF',
        description: 'Compile images into a PDF document. High-fidelity, drag-and-drop sequencing.',
        tag: 'CREATION',
        icon: <FileImage className="w-8 h-8 text-rose-500 group-hover:text-white transition-colors duration-500" />,
        version: 'v1.0'
    }
];

export default function PdfToolsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = pdfTools.filter(p =>
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
                            <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono">Document Processing // {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-6xl md:text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase text-black">
                            Bitviron<br />PDF Suite.
                        </h1>
                    </div>

                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:items-end text-left lg:text-right">
                        <div className="max-w-xs space-y-6">
                            <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase font-mono">
                                [ Document Core ]<br />
                                Professional-grade utilities for PDF manipulation and workflow management.
                            </p>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search utilities..."
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
                    {filtered.map((tool, idx) => (
                        <div key={tool.id} className="group flex flex-col justify-between h-full border-l border-slate-100 pl-8 relative">

                            {/* Vertical indexing */}
                            <div className="absolute left-[-1px] top-0 w-[1px] h-0 bg-black group-hover:h-full transition-all duration-700 ease-in-out"></div>

                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-black group-hover:rotate-6 transition-all duration-500 shadow-sm border border-slate-100">
                                        <div className="transition-colors duration-500 group-hover:text-white">
                                            {tool.icon}
                                        </div>
                                    </div>
                                    <span className="font-mono text-[10px] text-slate-300">0{idx + 1} // {tool.version}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase font-mono">
                                            {tool.tag}
                                        </span>
                                        <h3 className="text-3xl font-bold tracking-tight text-slate-900 group-hover:translate-x-2 transition-transform duration-500">
                                            {tool.name}
                                        </h3>
                                    </div>

                                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-12 text-black">
                                <Link
                                    href={`/tools/${tool.id}`}
                                    className="flex items-center gap-4 group/btn"
                                >
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
                    <span>Bitviron PDF Engine © {new Date().getFullYear()}</span>
                    <div className="flex gap-12">
                        <span>Latency: 8ms</span>
                        <span>Active Nodes: 12</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
