"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowRight, Star, Zap, Building2, MousePointer2 } from 'lucide-react';

const categories = [
    { id: 'all', label: 'All Articles', icon: null },
    { id: 'updates', label: 'Product Updates', icon: Zap, color: 'text-orange-500' },
    { id: 'company', label: 'Company', icon: Building2, color: 'text-green-500' },
    { id: 'productivity', label: 'Productivity', icon: MousePointer2, color: 'text-purple-500' },
];

const posts = [
    {
        id: 1,
        title: "Meet all the new Stack: The documentation platform you know, made effortless with AI",
        excerpt: "We've helped thousands of teams document their knowledge and create amazing public docs for their users. It's always been our goal to be your go-to platform for creating and collaborating on amazing documentation. Now we're taking that even fu...",
        category: 'updates',
        date: 'Feb 24, 2024',
        image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop',
    },
    {
        id: 2,
        title: "Using heatmaps to improve your website's UX: 5 ways to get started",
        excerpt: "From page design to site usability, there are plenty of factors that impact user experience. Pinpointing what leads to a bad experience can seem like a daunting task. With heatmaps (also known as \"heat maps\"), you can visualize key user interactions...",
        category: 'productivity',
        date: 'Feb 10, 2024',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop',
    },
    {
        id: 3,
        title: "How to create a cohesive omnichannel brand experience",
        excerpt: "Consistency is key in building trust. Learn how to maintain your brand voice and visual identity across every touchpoint, from social media to customer support.",
        category: 'company',
        date: 'Jan 24, 2024',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    },
    {
        id: 4,
        title: "The power and business value of visual storytelling",
        excerpt: "Why graphics and data visualization are more than just eye candy. Discover how high-impact visuals can drive conversions and simplify complex information.",
        category: 'productivity',
        date: 'Jan 15, 2024',
        image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2535&auto=format&fit=crop',
    },
    {
        id: 5,
        title: "The Rise of AI in Everyday Life: Navigating the New Normal",
        excerpt: "AI is no longer a futuristic concept. It's woven into the apps we use daily. We explore how to leverage these tools while maintaining a human-centric approach.",
        category: 'company',
        date: 'Jan 05, 2024',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop',
    },
    {
        id: 6,
        title: "Mastering the Art of Remote Collaboration in 2024",
        excerpt: "Working from anywhere is a superpower, but it requires the right mindset and tools. Discover our top strategies for staying connected and productive in a distributed team.",
        category: 'productivity',
        date: 'Dec 28, 2023',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: 7,
        title: "Evolving Your Visual Style: Trends to Watch This Year",
        excerpt: "From maximalism to neo-brutalism, we break down the visual trends that are defining the next wave of digital design and how to incorporate them into your work.",
        category: 'company',
        date: 'Dec 15, 2023',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    }
];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white pt-32 md:pt-40 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mb-20 md:mb-32 relative text-center flex flex-col items-center">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

                <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg mb-8">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blog</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-slate-900 tracking-tighter mb-8 max-w-4xl mx-auto px-4">
                        Insight and Updates
                    </h1>

                    <p className="text-base md:text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto px-4">
                        A collection of hand-picked articles for freelancers, by freelancers. Deep dives, insights, and honest advice to navigate the freelance landscape.
                    </p>
                </div>
            </div>

            {/* Featured Article & Grid */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                {posts.length > 0 && (
                    <div className="flex flex-col gap-24">
                        {/* Featured Post */}
                        <div className="group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Text Content (Left) */}
                            <div className="space-y-6 lg:pr-10 order-2 lg:order-1">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const cat = categories.find(c => c.id === posts[0].category);
                                        return (
                                            <div className="flex items-center gap-1.5">
                                                {cat?.icon && <cat.icon className={`w-4 h-4 ${cat.color}`} />}
                                                <span className={`text-sm font-bold uppercase tracking-widest ${cat?.color || 'text-slate-400'}`}>
                                                    {cat?.label.replace('Product ', '')}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">•</span>
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{posts[0].date}</span>
                                </div>

                                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-[1.1] tracking-tighter group-hover:text-blue-600 transition-colors">
                                    {posts[0].title}
                                </h2>

                                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                                    {posts[0].excerpt}
                                </p>

                                <div className="pt-2">
                                    <div className="flex items-center gap-2 text-base font-bold text-orange-600 group/link">
                                        <span>Learn More</span>
                                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Image (Right) */}
                            <div className="relative h-[250px] md:h-[320px] lg:h-[400px] w-full rounded-[30px] md:rounded-[40px] overflow-hidden bg-slate-100 border border-slate-50 order-1 lg:order-2">
                                <Image
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Recent Articles Label */}
                        <div className="pt-12 border-t border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-12">Recent Articles</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
                                {posts.slice(1).map((post) => (
                                    <div key={post.id} className="group cursor-pointer text-left">
                                        <div className="relative h-[220px] md:h-[320px] w-full rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 bg-slate-100 border border-slate-50">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const cat = categories.find(c => c.id === post.category);
                                                    return (
                                                        <div className="flex items-center gap-1.5">
                                                            {cat?.icon && <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />}
                                                            <span className={`text-xs font-bold uppercase tracking-widest ${cat?.color || 'text-slate-400'}`}>
                                                                {cat?.label.replace('Product ', '')}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">•</span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>

                                            <p className="text-base text-slate-500 font-medium leading-relaxed line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="pt-4">
                                                <div className="flex items-center gap-2 text-sm font-bold text-orange-600 group/link">
                                                    <span>Learn More</span>
                                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
