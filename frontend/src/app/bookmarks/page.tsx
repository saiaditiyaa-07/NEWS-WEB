"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Clock, Sparkles, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ArticleCard from "@/components/ArticleCard";

interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
}

export default function BookmarksPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"saved" | "history" | "interests">("saved");
  
  // Bookmarks & History lists
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [history, setHistory] = useState<Article[]>([]);
  
  // Interests state
  const defaultInterests = ["Politics", "Sports", "Technology", "Business", "Cinema"];
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    // Load Bookmarks
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(savedBookmarks);

    // Load History
    const savedHistory = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    setHistory(savedHistory);

    // Load Interests
    const savedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");
    setSelectedInterests(savedInterests.length > 0 ? savedInterests : ["Technology", "Science"]);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("bookmarksUpdated", loadData);
    return () => {
      window.removeEventListener("bookmarksUpdated", loadData);
    };
  }, []);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = () => {
    localStorage.setItem("userInterests", JSON.stringify(selectedInterests));
    setSuccessMsg(t("interestsSaved"));
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  };

  const clearHistory = () => {
    localStorage.removeItem("readingHistory");
    setHistory([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-[#F8F9FA] text-gray-900">
      
      {/* Return Navigation */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#d60000] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 text-[#d60000]" />
          <span>Back to Home Feed</span>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (3 cols): Tab selectors */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 border border-gray-200 rounded shadow-sm space-y-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#d60000] block">My Briefing Room</span>
            
            <div className="flex flex-col gap-2 font-bold text-xs">
              <button
                onClick={() => setActiveTab("saved")}
                className={`w-full py-2.5 px-3 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-[#003366] text-white border border-[#003366]"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-650"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>{language === "ta" ? "சேமித்தவை" : "Saved Articles"}</span>
                </div>
                <span className="text-[10px] font-black">{bookmarks.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`w-full py-2.5 px-3 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "history"
                    ? "bg-[#003366] text-white border border-[#003366]"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-650"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{language === "ta" ? "வாசிப்பு வரலாறு" : "Reading History"}</span>
                </div>
                <span className="text-[10px] font-black">{history.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("interests")}
                className={`w-full py-2.5 px-3 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "interests"
                    ? "bg-[#003366] text-white border border-[#003366]"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-650"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === "ta" ? "விருப்பங்கள்" : "My Interests"}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column (9 cols): Content panel */}
        <main className="lg:col-span-9 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm min-h-[400px] flex flex-col justify-between">
            
            <div>
              {/* Tab Header segment */}
              {activeTab === "saved" && (
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h1 className="serif-title text-xl font-black text-[#003366] flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-[#d60000] fill-[#d60000]/10" />
                    <span>{t("bookmarksTitle")}</span>
                  </h1>
                  <p className="text-xs text-gray-550 mt-1 font-semibold">{t("bookmarksSubtitle")}</p>
                </div>
              )}

              {activeTab === "history" && (
                <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="serif-title text-xl font-black text-[#003366] flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#d60000]" />
                      <span>{t("historyTitle")}</span>
                    </h1>
                    <p className="text-xs text-gray-555 mt-1 font-semibold">{t("historySubtitle")}</p>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="px-3 py-1.5 border border-red-200 hover:border-red-500 hover:text-red-500 rounded text-[10px] font-black uppercase text-red-700 bg-white cursor-pointer"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              )}

              {activeTab === "interests" && (
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h1 className="serif-title text-xl font-black text-[#003366] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d60000]" />
                    <span>{t("interestsTitle")}</span>
                  </h1>
                  <p className="text-xs text-gray-550 mt-1 font-semibold">{t("interestsSubtitle")}</p>
                </div>
              )}

              {/* Tab Contents */}
              {activeTab === "saved" && (
                <div>
                  {bookmarks.length === 0 ? (
                    <div className="py-12 border border-dashed border-gray-200 rounded text-center text-gray-400 font-bold text-xs">
                      No bookmarks saved. Click the save icon on any article detail page to compile your offline briefing list.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarks.map((art) => (
                        <ArticleCard key={art.id} article={art} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  {history.length === 0 ? (
                    <div className="py-12 border border-dashed border-gray-200 rounded text-center text-gray-400 font-bold text-xs">
                      Your ವಾசிப்பு வரலாறு (reading history) is empty. Visited articles will list here.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {history.map((art) => (
                        <ArticleCard key={art.id} article={art} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "interests" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {defaultInterests.map((interest) => {
                      const isSel = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`p-4 rounded border text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isSel
                              ? "border-[#d60000] bg-red-50/20 text-[#d60000] shadow-sm"
                              : "border-gray-200 hover:border-gray-450 bg-white text-gray-650"
                          }`}
                        >
                          <span className="serif-title text-sm">
                            {interest === "Politics" && (language === "ta" ? "அரசியல்" : "Politics")}
                            {interest === "Sports" && (language === "ta" ? "விளையாட்டு" : "Sports")}
                            {interest === "Technology" && (language === "ta" ? "தொழில்நுட்பம்" : "Technology")}
                            {interest === "Business" && (language === "ta" ? "வணிகம்" : "Business")}
                            {interest === "Cinema" && (language === "ta" ? "சினிமா" : "Cinema")}
                          </span>
                          {isSel && <CheckCircle2 className="w-4 h-4 text-[#d60000] fill-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={handleSaveInterests}
                      className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md cursor-pointer"
                    >
                      {t("saveInterests")}
                    </button>
                    {successMsg && (
                      <span className="text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{successMsg}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-150 text-[10px] font-bold text-gray-450 text-right uppercase">
              Kumari News Digital Briefing Room Sync
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}
