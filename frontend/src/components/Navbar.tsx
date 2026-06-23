"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, Bookmark, Menu, X, Newspaper, 
  Settings, Sparkles, Clock, Globe 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  // Localized Categories list
  const categories = [
    { name: "Tamil Nadu", name_ta: "தமிழ்நாடு", href: "/search?category=Tamil Nadu" },
    { name: "India", name_ta: "இந்தியா", href: "/search?category=India" },
    { name: "World", name_ta: "உலகம்", href: "/search?category=World" },
    { name: "Business", name_ta: "வணிகம்", href: "/search?category=Business" },
    { name: "Sports", name_ta: "விளையாட்டு", href: "/search?category=Sports" },
    { name: "Technology", name_ta: "தொழில்நுட்பம்", href: "/search?category=Technology" },
    { name: "Entertainment", name_ta: "சினிமா", href: "/search?category=Entertainment" },
    { name: "Education", name_ta: "கல்வி", href: "/education" },
    { name: "Jobs", name_ta: "வேலைவாய்ப்பு", href: "/jobs" },
    { name: "Saved Portfolio", name_ta: "சேமித்தவை", href: "/bookmarks" },
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
      const locale = language === "ta" ? "ta-IN" : "en-US";
      setCurrentTime(new Date().toLocaleDateString(locale, options));
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
    window.addEventListener("languageChanged", updateTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateBookmarks);
      window.removeEventListener("bookmarksUpdated", updateBookmarks);
      window.removeEventListener("languageChanged", updateTime);
    };
  }, [language]);

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
            <span>{t("digitalEdition")}</span>
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <Link href="/admin" className="flex items-center gap-1 hover:text-[#d60000] transition-colors">
            <Settings className="w-3 h-3" />
            <span>{t("adminConsole")}</span>
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
          <span className="serif-title font-black text-2xl tracking-tighter text-[#003366] uppercase">
            {language === "ta" ? "குமரி செய்திகள்" : "KUMARI NEWS"}
          </span>
          <span className="font-light text-gray-400 uppercase text-[9px] tracking-widest pl-1 hidden sm:inline">
            {language === "ta" ? "டிஜிட்டல்" : "DIGITAL"}
          </span>
        </Link>

        {/* Desktop Category Links */}
        <nav className="hidden xl:flex gap-4 text-[10px] font-black tracking-widest uppercase">
          {categories.map((cat) => {
            const displayName = language === "ta" ? cat.name_ta : cat.name;
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
                {displayName}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d60000] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Elements: Search, Language, Bookmark */}
        <div className="flex items-center gap-2">
          {/* Search Form (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder={t("searchIndex")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-[11px] font-semibold rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d60000] focus:border-[#d60000] w-36 focus:w-48 transition-all duration-300 placeholder:text-gray-400 text-gray-900"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-[9px] font-black uppercase tracking-wider shadow-sm select-none">
            <button
              onClick={() => setLanguage("en")}
              className={`hover:text-[#d60000] transition-colors cursor-pointer ${language === "en" ? "text-[#d60000] font-black" : "text-gray-450"}`}
            >
              EN
            </button>
            <span className="text-gray-300 text-[10px]">|</span>
            <button
              onClick={() => setLanguage("ta")}
              className={`hover:text-[#d60000] transition-colors cursor-pointer ${language === "ta" ? "text-[#d60000] font-black" : "text-gray-450"}`}
            >
              தமிழ்
            </button>
          </div>

          {/* Bookmarks Shortcut */}
          <Link
            href="/bookmarks"
            className="p-2 text-gray-500 hover:text-[#d60000] relative rounded hover:bg-gray-100 transition-all border border-gray-200 bg-white shadow-sm"
            title={t("viewPortfolio")}
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
            className="p-2 text-gray-600 hover:text-[#d60000] xl:hidden rounded-lg hover:bg-gray-100 transition-all border border-gray-200 bg-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          {/* Search (Mobile) */}
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d60000] focus:border-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Mobile Categories Links */}
          <div className="flex flex-col gap-3 font-bold text-xs uppercase tracking-wider">
            {categories.map((cat) => {
              const displayName = language === "ta" ? cat.name_ta : cat.name;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setIsOpen(false)}
                  className="py-1.5 px-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
                >
                  {displayName}
                </Link>
              );
            })}
            <div className="h-px bg-gray-200 my-1" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-gray-100 transition-colors text-[#d60000] flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>{t("adminConsole")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
