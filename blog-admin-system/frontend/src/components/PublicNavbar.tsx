"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, PenSquare, Rss } from "lucide-react";

const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/?category=Technology", label: "Technology" },
    { href: "/?category=Design", label: "Design" },
    { href: "/?category=Business", label: "Business" },
    { href: "/?category=Lifestyle", label: "Lifestyle" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            aria-label="BlogCMS Homepage"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Rss size={16} className="text-white" />
            </div>
            <span
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Blog<span className="text-indigo-600">CMS</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="btn btn-primary text-sm px-4 py-2 min-h-0 h-9"
              id="admin-login-btn"
            >
              <PenSquare size={14} />
              Admin
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                className="btn btn-primary w-full text-sm"
                onClick={() => setMobileOpen(false)}
              >
                <PenSquare size={14} />
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;
