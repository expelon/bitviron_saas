"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const images = [
    {
        id: 1,
        src: "/renitto.webp",
        alt: "Renitto - Product Designer",
        height: "h-[220px] md:h-[220px]",
        width: "md:w-[16vw]",
        number: "01"
    },
    {
        id: 2,
        src: "/anamika.webp",
        alt: "Anamika - Growth Executive",
        height: "h-[220px] md:h-[320px]",
        width: "md:w-[15vw]",
        number: "02"
    },
    {
        id: 3,
        src: "/founder.webp",
        alt: "Shabin Vs - Founder | CEO",
        height: "h-[300px] md:h-[420px]",
        width: "md:w-[25vw]",
        number: "03"
    },
    {
        id: 4,
        src: "/creative-director.webp",
        alt: "Sreelakshmi - Creative Associate",
        height: "h-[220px] md:h-[320px]",
        width: "md:w-[15vw]",
        number: "04"
    },
    {
        id: 5,
        src: "/rijas.webp",
        alt: "Rijas - Product Designer",
        height: "h-[220px] md:h-[220px]",
        width: "md:w-[16vw]",
        number: "05"
    }
];

const faqs = [
    {
        question: "What is Bitviron?",
        answer: "Bitviron is a modern digital tools platform offering practical online utility tools and carefully curated AI tool listings. Our mission is to help creators, students, developers, and businesses solve everyday digital tasks faster and more efficiently."
    },
    {
        question: "Are the tools on Bitviron free to use?",
        answer: "Most of our utility tools are completely free to use. In the future, some advanced features may be offered as premium options. Each tool page clearly states whether it is free or includes paid functionality. We believe in transparent pricing no hidden surprises."
    },
    {
        question: "Do you store or track uploaded files?",
        answer: "User privacy is a top priority. Files uploaded to our tools (such as PDF or image utilities) are processed securely and are not permanently stored on our servers. Any temporary processing data is automatically deleted after completion. We do not use uploaded content for tracking or analytics."
    },
    {
        question: "How do you select AI tools for listing?",
        answer: "We review AI tools based on functionality, reliability, real-world usefulness, and overall quality. Instead of listing every available tool, we focus on adding solutions that genuinely help users improve productivity and workflow. Quality always comes before quantity."
    },
    {
        question: "Can I submit my AI tool to Bitviron?",
        answer: "Yes. If you’ve built an AI tool or digital product, you can submit it for review. After evaluation, approved tools are added to our listings. We welcome innovative and problem-solving tools that align with our platform’s vision."
    },
    {
        question: "How often are tools updated?",
        answer: "Bitviron is actively maintained and updated. We regularly add new AI tools, refine listings, and improve our utility features to ensure the platform remains relevant and useful. Digital tools evolve quickly — and so do we."
    },
    {
        question: "Is Bitviron suitable for businesses?",
        answer: "Yes. Bitviron is built for individuals, startups, and growing businesses that want to improve productivity, streamline workflows, and simplify everyday digital operations. Whether you're managing documents, exploring AI tools, or automating small tasks, our platform is designed to save time and reduce complexity."
    },
    {
        question: "Do I need to create an account?",
        answer: "No account is required to use most of our tools. We focus on fast, frictionless access. Optional accounts may be introduced in the future for advanced features, saved preferences, or premium utilities but core tools will remain easily accessible."
    },
    {
        question: "How is Bitviron different from other AI directories?",
        answer: "Bitviron goes beyond simple AI tool listings. Alongside curated AI recommendations, we develop and maintain our own in-house digital utility tools. Instead of listing hundreds of tools without context, we prioritize clarity, real-world usefulness, and structured comparisons. Our goal is to create a focused productivity platform not just another directory."
    },
    {
        question: "How can I report a broken tool?",
        answer: "If you encounter a broken link, outdated listing, or inaccurate information, you can report it through our Contact page. Please include the tool name and issue details. We review reports promptly and keep the platform clean, updated, and reliable."
    },
    {
        question: "Can I request a new feature?",
        answer: "Yes. We actively welcome suggestions from our users. If there’s a tool you’d like us to build or an AI product you believe should be listed, reach out through our Contact page. Bitviron evolves based on community input and practical needs."
    },
    {
        question: "Is Bitviron constantly evolving?",
        answer: "Absolutely. The digital tools landscape changes rapidly, and so do we. We regularly add new AI tools, refine existing listings, and enhance our utilities to ensure the platform remains modern and useful. Our long-term vision is continuous improvement not static growth."
    }
];

export default function ContactPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-[#FDFDFD] overflow-hidden relative font-sans selection:bg-black selection:text-white pt-32 pb-20">

            {/* Background Text Overlay */}
            <div className="absolute top-[20%] -translate-y-1/2 left-0 w-full flex justify-center pointer-events-none select-none z-0">
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
                        Bitviron
                    </h1>
                </div>

                {/* Image Grid */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-1 md:gap-2 lg:gap-3 mb-32 md:mb-48">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className={`relative group cursor-pointer transition-all duration-700 ease-out md:hover:-translate-y-4`}
                        >
                            <div className="text-center mb-4 opacity-100 transition-opacity duration-300">
                                <span className="text-xs font-bold tracking-widest text-slate-900">{img.number}</span>
                            </div>

                            <div className={`relative w-[80vw] ${img.width} max-w-[500px] ${img.height} overflow-hidden grayscale md:hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl shadow-slate-200`}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover object-center transform md:scale-110 md:group-hover:scale-100 transition-transform duration-1000"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
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
