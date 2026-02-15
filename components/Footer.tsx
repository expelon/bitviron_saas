"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-slate-50 py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Bitviron</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Your complete digital tools solution platform designed to simplify everyday online tasks.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link href="/tools" className="hover:text-blue-600 transition-colors">Tools Library</Link></li>
              <li><Link href="/ai-tools" className="hover:text-blue-600 transition-colors">AI Utilities</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">API Access</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Premium Plans</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Legal & Support</h5>
            <div className="flex flex-col gap-4">
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Status Page</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} Bitviron Platform. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">Twitter</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">GitHub</Link>
            <Link href="#" className="text-sm text-slate-400 hover:text-slate-900 font-medium">Solutions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
