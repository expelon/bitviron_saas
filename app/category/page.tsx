"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Category data - Tool categories for Bitviron
const categories = [
    {
        id: 'pdf-tools',
        title: 'PDF Tools',
        subtitle: 'DOCUMENT & PDF UTILITIES',
        image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 'ai-tools',
        title: 'AI Tools',
        subtitle: 'ARTIFICIAL INTELLIGENCE',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 'design-tools',
        title: 'Design Tools',
        subtitle: 'CREATIVE & UI/UX',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2664&auto=format&fit=crop'
    },
    {
        id: 'development-tools',
        title: 'Development Tools',
        subtitle: 'CODE & BUILD',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2674&auto=format&fit=crop'
    },
    {
        id: 'marketing-tools',
        title: 'Marketing Tools',
        subtitle: 'DIGITAL MARKETING',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    },
    {
        id: 'productivity-tools',
        title: 'Productivity Tools',
        subtitle: 'WORKFLOW & EFFICIENCY',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2672&auto=format&fit=crop'
    },
    {
        id: 'analytics-tools',
        title: 'Analytics Tools',
        subtitle: 'DATA & INSIGHTS',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 'collaboration-tools',
        title: 'Collaboration Tools',
        subtitle: 'TEAM & COMMUNICATION',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 'automation-tools',
        title: 'Automation Tools',
        subtitle: 'WORKFLOW AUTOMATION',
        image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=2574&auto=format&fit=crop'
    },
    {
        id: 'security-tools',
        title: 'Security Tools',
        subtitle: 'PROTECTION & PRIVACY',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop'
    }
];

// Category Card Component with Center-Only Reveal
function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check on scroll for center detection
        const handleScroll = () => {
            if (!isMobile || !cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const cardCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(viewportCenter - cardCenter);

            // Reveal only if this card is in the center (within 150px)
            setIsVisible(distanceFromCenter < 150);
        };

        // Intersection Observer to trigger checks only when card is in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!isMobile) return;

                    if (entry.isIntersecting) {
                        handleScroll(); // Check if it's centered
                    } else {
                        setIsVisible(false); // Hide when out of viewport
                    }
                });
            },
            {
                threshold: [0.1, 0.5, 0.9],
                rootMargin: '0px'
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        if (isMobile) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial check
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    return (
        <Link
            ref={cardRef}
            href={`/category/${category.id}`}
            className="group relative bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl"
            style={{ aspectRatio: '3/4' }}
        >
            {/* Background Image - Center card only on mobile, hover on desktop */}
            <div
                className={`absolute inset-0 transition-opacity duration-700 ${isMobile
                    ? (isVisible ? 'opacity-100' : 'opacity-0')
                    : 'opacity-0 group-hover:opacity-100'
                    }`}
            >
                <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                {/* Subtitle */}
                <div>
                    <p
                        className={`text-[10px] md:text-xs uppercase tracking-widest mb-8 transition-colors duration-500 ${isMobile
                            ? (isVisible ? 'text-white/80' : 'text-slate-400')
                            : 'text-slate-400 group-hover:text-white/80'
                            }`}
                    >
                        {category.subtitle}
                    </p>
                </div>

                {/* Title */}
                <div className="flex-1 flex items-center">
                    <h2
                        className={`text-3xl md:text-4xl lg:text-5xl font-light leading-tight transition-colors duration-500 break-words ${isMobile
                            ? (isVisible ? 'text-white' : 'text-slate-900')
                            : 'text-slate-900 group-hover:text-white'
                            }`}
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        {category.title}
                    </h2>
                </div>

                {/* Link */}
                <div
                    className={`flex items-center gap-2 transition-colors duration-500 ${isMobile
                        ? (isVisible ? 'text-white' : 'text-slate-600')
                        : 'text-slate-600 group-hover:text-white'
                        }`}
                >
                    <span className="text-xs uppercase tracking-widest font-medium">
                        Go to collection
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}

export default function CategoryPage() {
    return (
        <div className="min-h-screen bg-[#F5F1ED] font-sans selection:bg-black selection:text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-[1800px] mx-auto">
                {/* Page Header */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                        Categories
                    </h1>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">
                        Explore our collections
                    </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
