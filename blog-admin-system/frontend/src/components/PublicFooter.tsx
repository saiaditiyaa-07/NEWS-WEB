"use client";

import React from "react";
import Link from "next/link";
import { Rss, Heart, Globe, BookOpen, ExternalLink } from "lucide-react";

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Rss size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                Blog<span className="text-indigo-400">CMS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              A modern, full-stack blog management platform built with Next.js and Express.js. Write, manage, and publish beautiful content.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {["Technology", "Design", "Business", "Lifestyle", "Education"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${cat}`}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              {[
                { icon: <Globe size={18} />, href: "#", label: "Website" },
                { icon: <BookOpen size={18} />, href: "#", label: "Documentation" },
                { icon: <ExternalLink size={18} />, href: "#", label: "Portfolio" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} BlogCMS. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500" /> using Next.js & Express.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
