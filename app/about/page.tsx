"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const images = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop", // Modern Office
        alt: "Modern Office Space",
        width: "col-span-12 md:col-span-5"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop", // Team Meeting
        alt: "Team Collaboration",
        width: "col-span-12 md:col-span-5"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2669&auto=format&fit=crop", // Office Interior
        alt: "Office Interior",
        width: "col-span-12 md:col-span-2"
    }
];

const team = [
    {
        name: "Shabin Vs",
        role: "Founder | CEO",
        image: "/founder.webp",
        order: "order-1 md:order-3"
    },
    {
        name: "Sreelakshmi",
        role: "Creative Associate",
        image: "/creative-director.webp",
        order: "order-2 md:order-4"
    },
    {
        name: "Renitto",
        role: "Product Designer",
        image: "/renitto.webp",
        order: "order-5 md:order-1"
    },
    {
        name: "Anamika",
        role: "Growth Executive",
        image: "/anamika.webp",
        order: "order-4 md:order-2"
    },
    {
        name: "Rijas",
        role: "Product Designer",
        image: "/rijas.webp",
        order: "order-3 md:order-5"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white pt-32 md:pt-40 overflow-x-hidden w-full">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">

                {/* Hero Section */}
                <div className="grid grid-cols-12 gap-8 mb-32 md:mb-48 relative">
                    {/* Main Title */}
                    <div className="col-span-12 md:col-span-8">
                        <h1 className="text-5xl md:text-[10vw] font-bold text-slate-900 leading-[0.9] tracking-tighter mb-12 md:mb-16 break-words">
                            About our<br />agency.
                        </h1>
                    </div>

                    {/* Secondary Info (Top Right) */}
                    <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-start">
                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-[280px]">
                            Based in the vibrant heart of the digital landscape, Bitviron is not just a tools platform; we're your partners in creation.
                        </p>
                    </div>

                    {/* Mission Statement & Scroll Circle */}
                    <div className="col-span-12 mt-12 md:mt-0 flex flex-col md:flex-row items-start md:items-end justify-between">
                        <div className="w-full md:max-w-2xl">
                            <p className="text-3xl md:text-3xl font-medium text-slate-900 md:text-slate-800 leading-tight">
                                Our mission is to turn your dreams into reality, one pixel at a time. With a diverse team of designers, developers, and innovators, we're constantly pushing the boundaries of what's possible in the digital world.
                            </p>
                        </div>

                        {/* Scroll Circle Button */}
                        <div className="mt-12 md:mt-0 hidden md:flex flex-col items-center group cursor-pointer">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                <span className="text-white text-sm font-medium">Scroll</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Grid Section */}
                <div className="grid grid-cols-12 gap-4 md:gap-6 mb-32 md:mb-48">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className={`relative h-[60vh] overflow-hidden ${img.width}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-1000 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    ))}
                </div>

                {/* Vision Section */}
                <div className="mb-32 md:mb-48">
                    <p className="text-3xl md:text-5xl font-medium text-slate-900 leading-tight max-w-5xl">
                        Founded with a vision to redefine design through a modern and friendly lens, we've become more than just a design agency; we're a community of kindred spirits who share a passion for artistry and innovation.
                    </p>
                </div>

                {/* "Who are we?" Section */}
                <div className="mb-32 md:mb-48">
                    <h2 className="text-6xl md:text-8xl font-bold text-slate-900 mb-20 tracking-tighter">
                        Who are we?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                        {/* Left Column */}
                        <div className="space-y-32">
                            <div className="max-w-xs">
                                <p className="text-base text-slate-500 font-medium leading-relaxed">
                                    We're the designers who believe in the power of a warm smile and a friendly chat.
                                </p>
                            </div>

                            <div className="max-w-xs">
                                <p className="text-base text-slate-400 font-medium leading-relaxed">
                                    Ready to build unforgettable brands, Bitviron Studio.
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-16">
                            <div className="max-w-xl">
                                <p className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed">
                                    We thrive on turning your wildest design aspirations into stunning realities. At Bitviron, every project is a collaboration, every client is a friend, and every design is a work of art crafted with care and enthusiasm.
                                </p>
                            </div>

                            <div className="max-w-xl">
                                <p className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
                                    We're here to make your design dreams come true.
                                </p>
                            </div>

                            <div className="relative h-[400px] md:h-[500px] w-full mt-8">
                                <Image
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop"
                                    alt="Team Collaboration"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* "Our Team" Section */}
                <div className="mb-32 md:mb-48 relative">
                    <div className="mb-16">
                        <h2 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter mb-6">
                            Our Team
                        </h2>
                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Our team is a tight-knit family of designers, artists, and visionaries, all bound by the same creative enthusiasm.
                        </p>
                    </div>

                    {/* Team Members List */}
                    <div className="relative group overflow-x-clip">
                        <div className="flex flex-col md:flex-row gap-16 md:gap-6 md:overflow-x-auto pt-20 pb-12 md:scrollbar-hide md:no-scrollbar cursor-default md:cursor-grab active:md:cursor-grabbing snap-y md:snap-x items-center md:items-start">
                            {team.map((member, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 flex flex-col items-center group/member snap-center md:snap-start transition-all duration-700 ${member.order} 
                                        ${index % 2 !== 0
                                            ? 'md:-translate-y-14'
                                            : ''
                                        }`}
                                >
                                    <div className="w-[200px] h-[200px] md:w-[210px] md:h-[210px] rounded-full overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-700 bg-slate-100">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={250}
                                            height={250}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/member:scale-105"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-lg md:text-base font-bold text-slate-900 mb-1">
                                            {member.name}
                                        </h4>
                                        <p className="text-xs md:text-xs text-slate-400 font-medium uppercase tracking-widest">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact CTA Section */}
                <div className="relative -mx-8 md:-mx-12 mt-32 md:mt-48">
                    <div className="bg-black py-32 md:py-48 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-16">
                        <div className="max-w-4xl">
                            <h2 className="text-5xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter">
                                Let's talk today, and turn your ideas into digital masterpieces.
                            </h2>
                        </div>

                        <Link href="/contact" className="group">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110 relative">
                                <span className="text-black text-xs md:text-sm font-bold uppercase tracking-widest text-center mb-2 px-4">
                                    Get in<br />Touch
                                </span>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                                    <ArrowUpRight className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
