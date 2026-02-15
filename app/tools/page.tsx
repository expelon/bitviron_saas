"use client";

import React, { useState } from 'react';
import { Search, ArrowUpRight, Sparkles, Zap, Layout, Code, PenTool, TrendingUp, BarChart, Globe, Command, Filter } from 'lucide-react';

const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'ai', label: 'AI' },
    { id: 'design', label: 'DESIGN' },
    { id: 'dev', label: 'DEV' },
    { id: 'prod', label: 'PROD' },
];

const tools = [
    { id: 1, name: "Midjourney", desc: "Generative AI Art", cat: "ai", year: "2023", icon: Sparkles },
    { id: 2, name: "ChatGPT", desc: "OpenAI Model", cat: "ai", year: "2022", icon: Zap },
    { id: 3, name: "Figma", desc: "Interface Design", cat: "design", year: "2016", icon: Layout },
    { id: 4, name: "Notion", desc: "Workspace OS", cat: "prod", year: "2018", icon: PenTool },
    { id: 5, name: "Vercel", desc: "Frontend Cloud", cat: "dev", year: "2015", icon: Globe },
    { id: 6, name: "Copilot", desc: "AI Pair Programmer", cat: "dev", year: "2021", icon: Code },
    { id: 7, name: "Framer", desc: "No-Code Builder", cat: "design", year: "2019", icon: Layout },
    { id: 8, name: "Linear", desc: "Issue Tracking", cat: "prod", year: "2020", icon: TrendingUp },
];

export default function ToolsPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = tools.filter(tool => {
        const matchesCategory = activeCategory === 'all' || tool.cat === activeCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F4F4F0] text-black font-sans pt-24 pb-24 selection:bg-black selection:text-white">

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="border-b-2 border-black pb-12 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
                                <span className="text-xs font-mono uppercase tracking-widest">Bitviron Directory 2024</span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                                Tool<br />Index
                            </h1>
                        </div>

                        <div className="max-w-xs">
                            <p className="font-mono text-xs leading-relaxed mb-6">
                                [ SYSTEM NOTE ]<br />
                                A collection of high-performance utilities for modern digital craftsmen. Access verified tools.
                            </p>

                            {/* Search Input */}
                            <div className="relative border-2 border-black bg-white">
                                <input
                                    type="text"
                                    placeholder="SEARCH KEYWORD..."
                                    className="w-full bg-transparent p-3 pr-10 font-mono text-sm uppercase placeholder:text-gray-400 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Command className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="border-2 border-black bg-white mb-12 overflow-x-auto no-scrollbar">
                    <div className="flex">
                        <div className="p-4 border-r-2 border-black flex items-center justify-center bg-[#F4F4F0]">
                            <Filter className="w-5 h-5" />
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-8 py-4 font-mono text-sm uppercase tracking-widest border-r-2 border-black last:border-r-0 whitespace-nowrap transition-all
                                ${activeCategory === cat.id
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t-2 border-l-2 border-black bg-white">
                    {filteredTools.map((tool, index) => (
                        <div
                            key={tool.id}
                            className="group relative border-r-2 border-b-2 border-black p-8 aspect-square flex flex-col justify-between hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-xs opacity-50">0{index + 1}</span>
                                <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Middle Icon area */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-500 group-hover:scale-110">
                                <tool.icon className="w-16 h-16 stroke-[1.5]" />
                            </div>

                            {/* Bottom Info */}
                            <div>
                                <div className="flex justify-between items-end border-b border-black group-hover:border-white pb-2 mb-2">
                                    <span className="font-mono text-xs uppercase opacity-70">{tool.cat}</span>
                                    <span className="font-mono text-xs opacity-50">{tool.year}</span>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight uppercase">{tool.name}</h3>
                                <p className="text-xs font-mono mt-2 opacity-0 h-0 group-hover:opacity-70 group-hover:h-auto transition-all duration-300">
                                    {tool.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Empty Grid Fillers (Decorative) */}
                    {[...Array(4 - (filteredTools.length % 4 || 4))].map((_, i) => (
                        <div key={`filler-${i}`} className="hidden lg:block border-r-2 border-b-2 border-black bg-[#F4F4F0] opacity-50 pattern-diagonal-lines"></div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-12 border-t-2 border-black pt-4 flex justify-between font-mono text-xs uppercase">
                    <span>© 2024 Bitviron Systems</span>
                    <span className="hidden md:inline">Scroll for more</span>
                    <span>v2.0.4</span>
                </div>

            </div>

            {/* CSS Pattern for filler cells */}
            <style jsx>{`
                .pattern-diagonal-lines {
                    background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px);
                }
            `}</style>
        </div>
    );
}
