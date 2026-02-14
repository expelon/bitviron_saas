"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import ToolGrid from '../components/ToolGrid';
import Footer from '../components/Footer';
import AIToolModal from '../components/AIToolModal';
import { Tool } from '../types';

export default function Home() {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleToolClick = (tool: Tool) => {
        setSelectedTool(tool);
    };

    return (
        <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans">
            <Header isScrolled={isScrolled} />

            <main>
                {/* Section 1: Hero (Tools Focused) */}
                <Hero onCtaClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })} />

                {/* Section 2: Tools Grid */}
                <section id="tools-grid" className="py-24 bg-white relative">
                    <div className="max-container px-6">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">Power Engine</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-display">A complete digital toolbox.</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                                Stop juggling tabs. Access all your essential developer and creator utilities in one high-performance interface.
                            </p>
                        </div>

                        <ToolGrid onToolSelect={handleToolClick} />
                    </div>
                </section>

                {/* Section 3: Branding/Marketing (Sapforce Style) */}
                <FeatureSection />

                {/* Section 4: Stats / CTA */}
                <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="max-container px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight font-display">READY TO BOOST FLOW?</h2>
                            <p className="text-xl text-slate-300 mb-10 max-w-lg">
                                Join 2M+ users worldwide who simplify their digital life with Bitviron's utility engine.
                            </p>
                            <button
                                onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-[#D2FF00] text-black font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform flex items-center gap-2 group"
                            >
                                Get Started Now
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 font-display">2M+</div>
                                    <div className="text-slate-400 uppercase tracking-widest text-xs">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 font-display">50+</div>
                                    <div className="text-slate-400 uppercase tracking-widest text-xs">Smart Tools</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 font-display">99.9%</div>
                                    <div className="text-slate-400 uppercase tracking-widest text-xs">Uptime</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 font-display">24/7</div>
                                    <div className="text-slate-400 uppercase tracking-widest text-xs">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {selectedTool && (
                <AIToolModal
                    tool={selectedTool}
                    isOpen={!!selectedTool}
                    onClose={() => setSelectedTool(null)}
                />
            )}

            <style jsx global>{`
        .max-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .font-display {
          font-family: var(--font-plus-jakarta), sans-serif;
        }
      `}</style>
        </div>
    );
}
