"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, Bookmark, Menu, X, Newspaper, 
  Settings, Sparkles, Clock 
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Categories list
  const categories = [
    { name: "Technology", href: "/search?category=Technology" },
    { name: "Science", href: "/search?category=Science" },
    { name: "Business", href: "/search?category=Business" },
    { name: "Politics", href: "/search?category=Politics" },
    { name: "Entertainment", href: "/search?category=Entertainment" },
  ];

  // Update clock & load bookmarks
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(new Date().toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    const updateBookmarks = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarkCount(bookmarks.length);
    };

    updateBookmarks();
    window.addEventListener("storage", updateBookmarks);
    window.addEventListener("bookmarksUpdated", updateBookmarks);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateBookmarks);
      window.removeEventListener("bookmarksUpdated", updateBookmarks);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 transition-colors shadow-sm">
      {/* Top Banner: Date, Time */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1.5 text-[11px] font-bold tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#d60000]" />
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#003366] uppercase tracking-widest text-[10px] font-black">
            <Sparkles className="w-3 h-3 text-[#d60000]" />
            <span>Digital Edition</span>
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <Link href="/admin" className="flex items-center gap-1 hover:text-[#d60000] transition-colors">
            <Settings className="w-3 h-3" />
            <span>Admin Console</span>
          </Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900">
          <div className="p-1.5 rounded bg-[#d60000] text-white shadow-sm">
            <Newspaper className="w-5 h-5" />
          </div>
          <span className="serif-title font-black text-2xl tracking-tighter text-[#003366]">
            AETHER
          </span>
          <span className="font-light text-gray-400 uppercase text-xs tracking-widest pl-1">NEWS</span>
        </Link>

        {/* Desktop Category Links */}
        <nav className="hidden md:flex gap-6 text-xs font-black tracking-widest uppercase">
          {categories.map((cat) => {
            const isActive = pathname === cat.href || (pathname === "/search" && pathname.includes(cat.name));
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`transition-colors hover:text-[#d60000] relative py-1 ${
                  isActive 
                    ? "text-[#d60000]" 
                    : "text-gray-600"
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d60000] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Elements: Search, Bookmark */}
        <div className="flex items-center gap-3">
          {/* Search Form (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="Search index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs font-semibold rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d60000] focus:border-[#d60000] w-44 focus:w-60 transition-all duration-300 placeholder:text-gray-400 text-gray-900"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Bookmarks Shortcut */}
          <Link
            href="/search?bookmarks=true"
            className="p-2 text-gray-500 hover:text-[#d60000] relative rounded hover:bg-gray-100 transition-all"
            title="Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d60000] text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-650 hover:text-[#d60000] md:hidden rounded-lg hover:bg-gray-100 transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          {/* Search (Mobile) */}
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search topics, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d60000] focus:border-[#d60000] placeholder:text-gray-450 text-gray-900"
            />
            <Search className="w-4 h-4 text-gray-450 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Mobile Categories Links */}
          <div className="flex flex-col gap-3 font-bold text-xs uppercase tracking-wider">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setIsOpen(false)}
                className="py-1.5 px-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              >
                {cat.name}
              </Link>
            ))}
            <div className="h-px bg-gray-200 my-1" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-gray-100 transition-colors text-[#d60000] flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
