"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AIToolsPage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set fixed launch date to April 6, 2026
        // Using a fixed date ensures the timer doesn't reset on refresh
        const launchDate = new Date('2026-04-06T00:00:00');

        const timer = setInterval(() => {
            const now = new Date();
            const difference = launchDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="min-h-screen w-full bg-[#F5F1ED] text-[#1A1A1A] font-sans selection:bg-black selection:text-white flex flex-col relative">
            {/* Custom Minimal Header Position Spacer - allows default header to sit on top without overlapping content awkwardly if it was static */}
            <div className="h-24"></div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20 z-10">
                <div className="text-center w-full max-w-5xl mx-auto">

                    {/* Intro Text */}
                    <h2 className="text-xl md:text-2xl font-medium mb-12 md:mb-16 tracking-wide text-gray-800">
                        The AI tools launching in
                    </h2>

                    {/* Countdown Timer */}
                    <div className="flex flex-wrap justify-center items-end gap-2 sm:gap-4 md:gap-12 mb-16 md:mb-24 select-none">
                        <div className="flex flex-col items-center group cursor-default">
                            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter tabular-nums transition-transform duration-500 group-hover:-translate-y-2">
                                {formatNumber(timeLeft.days)}
                            </span>
                            <span className="text-[10px] sm:text-sm md:text-base font-medium mt-2 md:mt-4 text-gray-500 uppercase tracking-widest">Days</span>
                        </div>

                        <span className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-gray-400 mb-6 sm:mb-8 md:mb-10">:</span>

                        <div className="flex flex-col items-center group cursor-default">
                            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter tabular-nums transition-transform duration-500 group-hover:-translate-y-2 delay-75">
                                {formatNumber(timeLeft.hours)}
                            </span>
                            <span className="text-[10px] sm:text-sm md:text-base font-medium mt-2 md:mt-4 text-gray-500 uppercase tracking-widest">Hours</span>
                        </div>

                        <span className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-gray-400 mb-6 sm:mb-8 md:mb-10">:</span>

                        <div className="flex flex-col items-center group cursor-default">
                            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter tabular-nums transition-transform duration-500 group-hover:-translate-y-2 delay-100">
                                {formatNumber(timeLeft.minutes)}
                            </span>
                            <span className="text-[10px] sm:text-sm md:text-base font-medium mt-2 md:mt-4 text-gray-500 uppercase tracking-widest">Mins</span>
                        </div>

                        <span className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-gray-400 mb-6 sm:mb-8 md:mb-10">:</span>

                        <div className="flex flex-col items-center group cursor-default">
                            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter tabular-nums transition-transform duration-500 group-hover:-translate-y-2 delay-150">
                                {formatNumber(timeLeft.seconds)}
                            </span>
                            <span className="text-[10px] sm:text-sm md:text-base font-medium mt-2 md:mt-4 text-gray-500 uppercase tracking-widest">Secs</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="inline-block relative group">
                        <Link
                            href="/tools"
                            className="flex items-center gap-3 text-lg md:text-xl font-medium tracking-wide pb-1 border-b-2 border-black hover:opacity-70 transition-all"
                        >
                            EXPLORE TOOLS
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
