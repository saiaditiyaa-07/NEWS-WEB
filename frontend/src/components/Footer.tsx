"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, Send, ArrowUp, CheckCircle, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-gray-200 bg-[#f8f9fa] py-12 mt-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-gray-200">
          
          {/* Logo & Description */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
              <div className="p-1.5 rounded bg-[#d60000] text-white shadow-sm">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="serif-title font-black text-2xl tracking-tighter text-[#003366]">
                AETHER
              </span>
              <span className="font-light text-gray-400 uppercase text-xs tracking-widest pl-1">NEWS</span>
            </Link>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed font-semibold">
              Enterprise-grade digital reporting delivering real-time geo-political, scientific, and technological intelligence. Curated for builders, investors, and pioneers.
            </p>
          </div>

          {/* Newsletter Widget */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-3">
            <h4 className="text-xs font-black tracking-widest uppercase text-gray-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#d60000]" />
              <span>Aether Intelligence Briefing</span>
            </h4>
            <p className="text-xs text-gray-600 font-semibold">
              Join over 84,000+ subscribers for twice-weekly AI-summarized insights on global markets and frontiers.
            </p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-250 p-3 rounded-lg max-w-md animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Subscription confirmed! Welcome to the briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#d60000] hover:bg-[#b50000] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 uppercase tracking-wider"
                >
                  {loading ? "Syncing..." : <><span>Brief Me</span><Send className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section: Navigation columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-sm font-semibold text-gray-600">
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">Categories</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/search?category=Technology" className="hover:text-[#d60000] transition-colors">Technology</Link></li>
              <li><Link href="/search?category=Science" className="hover:text-[#d60000] transition-colors">Science</Link></li>
              <li><Link href="/search?category=Business" className="hover:text-[#d60000] transition-colors">Business</Link></li>
              <li><Link href="/search?category=Politics" className="hover:text-[#d60000] transition-colors">Politics</Link></li>
              <li><Link href="/search?category=Entertainment" className="hover:text-[#d60000] transition-colors">Entertainment</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">Corporate</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-[#d60000] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">Press Inquiries</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">Sponsorships</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">Developers & API</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-[#d60000] transition-colors">System Schema Docs</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">FastAPI Endpoint Index</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">Service Status</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">Platform Portal</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/admin" className="hover:text-[#d60000] transition-colors">Publisher Dashboard</Link></li>
              <li><Link href="/admin/articles" className="hover:text-[#d60000] transition-colors">Editor CMS Console</Link></li>
              <li><Link href="/search?bookmarks=true" className="hover:text-[#d60000] transition-colors">Saved Briefings</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Legal & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200 text-xs text-gray-500 font-bold">
          <div>
            &copy; {new Date().getFullYear()} Aether Digital Network. All rights reserved. Powered by Next.js 15 & FastAPI.
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-[#d60000] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#d60000] transition-colors">Terms of Use</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center bg-white"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#d60000]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
