"use client";

import React from 'react';
import Image from 'next/image';

const images = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?q=80&w=2670&auto=format&fit=crop", // Model
        alt: "Studio Portrait 01",
        height: "h-[150px] md:h-[220px]",
        width: "md:w-[16vw]",
        number: "01"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2690&auto=format&fit=crop", // Model
        alt: "Studio Portrait 02",
        height: "h-[220px] md:h-[320px]",
        width: "md:w-[15vw]",
        number: "02"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1510227272981-87123e259b17?q=80&w=2574&auto=format&fit=crop", // Center Model
        alt: "Studio Portrait 03",
        height: "h-[300px] md:h-[420px]",
        width: "md:w-[25vw]",
        number: "03"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2574&auto=format&fit=crop", // Model
        alt: "Studio Portrait 04",
        height: "h-[220px] md:h-[320px]",
        width: "md:w-[15vw]",
        number: "04"
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop", // Model
        alt: "Studio Portrait 05",
        height: "h-[150px] md:h-[220px]",
        width: "md:w-[16vw]",
        number: "05"
    }
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] overflow-hidden relative font-sans selection:bg-black selection:text-white pt-32 pb-20">

            {/* Background Text Overlay */}
            <div className="absolute top-[25%] -translate-y-1/2 left-0 w-full flex justify-center pointer-events-none select-none z-0">
                <h1 className="text-[18vw] font-[1000] text-slate-900/[0.05] uppercase tracking-tighter leading-none scale-y-110">
                    TheStudio
                </h1>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 md:px-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                        Connect With
                    </h1>
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase">
                        Our Studio
                    </h1>
                </div>

                {/* Image Grid */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-1 md:gap-2 lg:gap-3 mb-32 md:mb-48">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className={`relative group cursor-pointer transition-all duration-700 ease-out hover:-translate-y-4`}
                        >
                            <div className="text-center mb-4 opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-bold tracking-widest text-slate-900">{img.number}</span>
                            </div>

                            <div className={`relative w-[80vw] ${img.width} max-w-[500px] ${img.height} overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl shadow-slate-200`}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover object-center transform scale-110 group-hover:scale-100 transition-transform duration-1000"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Form Section */}
                <div className="relative mb-32 md:mb-48">
                    {/* Background Text for Section - "STUDIO" */}
                    <div className="absolute top-[20%] -translate-y-1/2 left-0 w-full pointer-events-none select-none z-0">
                        <h1 className="text-[20vw] font-[1000] text-slate-900/[0.04] uppercase tracking-tighter leading-none scale-y-110 ml-[-5%]">
                            Studio
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end relative z-10">
                        {/* Left side text (Moved to bottom) */}
                        <div className="max-w-xs pb-4">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-900 leading-relaxed">
                                Bitviron is a powerhouse for digital creators and developers. We build tools that streamline your workflow and elevate your creative process. Reach out to discuss collaborations or custom digital solutions.
                            </p>
                        </div>

                        {/* Right side form */}
                        <div className="space-y-12">
                            <div className="group">
                                <input
                                    type="text"
                                    placeholder="[ YOUR NAME ]"
                                    className="w-full bg-transparent border-b-2 border-slate-900 py-4 text-sm font-bold uppercase tracking-widest placeholder:text-slate-900 focus:outline-none transition-all focus:border-blue-600"
                                />
                            </div>
                            <div className="group">
                                <input
                                    type="email"
                                    placeholder="[ YOUR EMAIL ]"
                                    className="w-full bg-transparent border-b-2 border-slate-900 py-4 text-sm font-bold uppercase tracking-widest placeholder:text-slate-900 focus:outline-none transition-all focus:border-blue-600"
                                />
                            </div>
                            <div className="group">
                                <textarea
                                    placeholder="[ MESSAGE ]"
                                    rows={1}
                                    className="w-full bg-transparent border-b-2 border-slate-900 py-4 text-sm font-bold uppercase tracking-widest placeholder:text-slate-900 focus:outline-none transition-all focus:border-blue-600 resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-8">
                                <button className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-14 py-4 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content ends here */}
            </div>
        </div>
    );
}
