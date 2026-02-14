"use client";

import React, { useState } from 'react';
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

const faqs = [
    {
        question: "How long does a project take?",
        answer: "Each project's timeline depends on the scope. A simple landing page can be completed within 2 weeks while a full e-commerce platform might take 3 – 6 weeks. Once we understand your needs, we'll give you a clear, realistic timeline."
    },
    {
        question: "Can I manage a site after it's built?",
        answer: "Yes, we build our sites using easy-to-use CMS platforms that allow you to manage and update your content without any technical knowledge. We also provide documentation and training to help you get started."
    },
    {
        question: "How does pricing work?",
        answer: "Our pricing is tailored to the specific needs of each project. We offer competitive rates and transparent pricing models. We'll provide you with a detailed quote after we've discussed your requirements."
    },
    {
        question: "What tools are used in building?",
        answer: "We use a variety of state-of-the-art tools and technologies to build high-performance websites and applications. Our stack includes React, Next.js, Tailwind CSS, and other modern frameworks."
    },
    {
        question: "How much does it cost to build an app?",
        answer: "The cost of building an app varies depending on its complexity and features. We'll work with you to understand your goals and budget, and provide you with a comprehensive proposal."
    }
];

export default function ContactPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

                {/* FAQ Section */}
                <div className="mb-20 md:mb-32 max-w-4xl mx-auto">
                    <div className="mb-16">
                        <span className="text-sm font-medium text-slate-400 block mb-4">
                            Frequently Asked Questions
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                            Your Questions<br />Answered Here
                        </h2>
                    </div>

                    <div className="space-y-0 border-t border-slate-100">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-slate-100 py-10 transition-colors hover:bg-slate-50/50">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="w-full flex justify-between items-center text-left group px-2"
                                >
                                    <h3 className="text-lg md:text-xl font-medium text-slate-900 pr-8">
                                        {faq.question}
                                    </h3>
                                    <div className="text-2xl md:text-3xl text-slate-400 group-hover:text-slate-900 transition-colors">
                                        {openFaqIndex === index ? '×' : '+'}
                                    </div>
                                </button>

                                <div className={`grid transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden px-2">
                                        <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* New Form Section */}
                <div className="relative mb-16 md:mb-24">
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
