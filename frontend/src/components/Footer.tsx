"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, Send, ArrowUp, CheckCircle, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

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

  // Localized links definition
  const categoryLinks = [
    { name: "Tamil Nadu", name_ta: "தமிழ்நாடு", href: "/search?category=Tamil Nadu" },
    { name: "India", name_ta: "இந்தியா", href: "/search?category=India" },
    { name: "World", name_ta: "உலகம்", href: "/search?category=World" },
    { name: "Business", name_ta: "வணிகம்", href: "/search?category=Business" },
    { name: "Sports", name_ta: "விளையாட்டு", href: "/search?category=Sports" },
    { name: "Technology", name_ta: "தொழில்நுட்பம்", href: "/search?category=Technology" },
    { name: "Entertainment", name_ta: "சினிமா", href: "/search?category=Entertainment" },
  ];

  return (
    <footer className="relative border-t border-gray-200 bg-[#f8f9fa] py-12 mt-16 transition-colors text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-gray-200">
          
          {/* Logo & Description */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
              <div className="p-1.5 rounded bg-[#d60000] text-white shadow-sm">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="serif-title font-black text-2xl tracking-tighter text-[#003366] uppercase">
                {language === "ta" ? "குமரி செய்திகள்" : "KUMARI NEWS"}
              </span>
              <span className="font-light text-gray-400 uppercase text-xs tracking-widest pl-1">
                {language === "ta" ? "பதிப்பு" : "DIGITAL"}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed font-semibold">
              {t("footerText")}
            </p>
          </div>

          {/* Newsletter Widget */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-3">
            <h4 className="text-xs font-black tracking-widest uppercase text-gray-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#d60000]" />
              <span>{language === "ta" ? "குமரி செய்திமடல்" : "Kumari Intelligence Briefing"}</span>
            </h4>
            <p className="text-xs text-gray-600 font-semibold">
              {language === "ta" 
                ? "கணப்பொழுதில் பகுப்பாய்வு செய்யப்பட்ட உள்ளூர் மற்றும் உலகளாவிய செய்திகளைப் பெற 84,000+ வாசகர்களுடன் இணையுங்கள்." 
                : "Join over 84,000+ subscribers for twice-weekly AI-summarized insights on global markets and local frontiers."
              }
            </p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg max-w-md animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{language === "ta" ? "சந்தா உறுதிப்படுத்தப்பட்டது! செய்திமடலுக்கு வரவேற்கிறோம்." : "Subscription confirmed! Welcome to the briefing."}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder={language === "ta" ? "மின்னஞ்சல் முகவரி..." : "Enter email address..."}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#d60000] hover:bg-[#b50000] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                >
                  {loading ? (
                    language === "ta" ? "ஒத்திசைக்கிறது..." : "Syncing..."
                  ) : (
                    <>
                      <span>{language === "ta" ? "சந்தா சேர்" : "Subscribe"}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section: Navigation columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-sm font-semibold text-gray-600">
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">{t("categoriesHeader")}</h5>
            <ul className="space-y-2 text-xs font-semibold">
              {categoryLinks.map(cat => {
                const displayName = language === "ta" ? cat.name_ta : cat.name;
                return (
                  <li key={cat.name}>
                    <Link href={cat.href} className="hover:text-[#d60000] transition-colors">{displayName}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">{t("corporateHeader")}</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "எங்களைப் பற்றி" : "About Us"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "பத்திரிகை வெளியீடு" : "Press Inquiries"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "பணி வாய்ப்புகள்" : "Careers"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "விளம்பரம் செய்ய" : "Sponsorships"}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">{t("developersHeader")}</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "தரவுத்தள வடிவமைப்பு" : "System Schema Docs"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "ஏபிஐ முகவரி" : "FastAPI Endpoint Index"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "கிட்ஹப் தகவல்" : "GitHub Repository"}</a></li>
              <li><a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "சேவை நிலை" : "Service Status"}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-gray-800 uppercase tracking-widest">{t("platformHeader")}</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/admin" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "நிர்வாகப் பலகை" : "Publisher Dashboard"}</Link></li>
              <li><Link href="/admin/articles" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "செய்தி மேலாண்மை" : "Editor CMS Console"}</Link></li>
              <li><Link href="/bookmarks" className="hover:text-[#d60000] transition-colors">{t("viewPortfolio")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Legal & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200 text-xs text-gray-500 font-bold">
          <div>
            &copy; {new Date().getFullYear()} {language === "ta" ? "குமரி செய்திகள் நெட்வொர்க்." : "Kumari News Digital Network."} {t("copyright")}
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "தனியுரிமைக் கொள்கை" : "Privacy Policy"}</a>
            <a href="#" className="hover:text-[#d60000] transition-colors">{language === "ta" ? "பயன்பாட்டு விதிகள்" : "Terms of Use"}</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center bg-white cursor-pointer"
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
