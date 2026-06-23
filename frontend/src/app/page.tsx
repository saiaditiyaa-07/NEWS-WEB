"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Star, TrendingUp, Mail, 
  Smartphone, Monitor, ExternalLink, Globe, ChevronRight, MapPin 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BreakingNews from "@/components/BreakingNews";
import HomeFeed from "@/components/HomeFeed";

// Import Widgets
import WeatherWidget from "@/components/widgets/WeatherWidget";
import RatesWidget from "@/components/widgets/RatesWidget";
import SportsWidget from "@/components/widgets/SportsWidget";
import EducationWidget from "@/components/widgets/EducationWidget";
import JobAlertsWidget from "@/components/widgets/JobAlertsWidget";
import EpaperWidget from "@/components/widgets/EpaperWidget";

interface ArticleData {
  id: string;
  title: string;
  title_ta: string;
  summary: string;
  summary_ta: string;
  image: string;
  category: string;
  category_ta: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
  editors_pick: boolean;
  trending: boolean;
  district?: string;
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  // List of Tamil Nadu Districts
  const districts = [
    { name: "Chennai", name_ta: "சென்னை" },
    { name: "Madurai", name_ta: "மதுரை" },
    { name: "Coimbatore", name_ta: "கோயம்புத்தூர்" },
    { name: "Trichy", name_ta: "திருச்சி" },
    { name: "Salem", name_ta: "சேலம்" },
    { name: "Erode", name_ta: "ஈரோடு" },
    { name: "Tirunelveli", name_ta: "திருநெல்வேலி" },
    { name: "Ramanathapuram", name_ta: "இராமநாதபுரம்" },
    { name: "Kanyakumari", name_ta: "கன்னியாகுமரி" },
    { name: "Thoothukudi", name_ta: "தூத்துக்குடி" },
    { name: "Vellore", name_ta: "வேலூர்" }
  ];

  useEffect(() => {
    const loadHomepageData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/articles");
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        } else {
          throw new Error();
        }
      } catch (err) {
        // Fallback mock articles if backend is unreachable
        setArticles([
          {
            id: "1",
            title: "Quantum Photonic Accelerators Enter Commercial Production in Tamil Nadu Fab",
            title_ta: "குவாண்டம் ஃபோட்டானிக் முடுக்கிகள் வணிகமயமாக்கல்: தமிழகத்தில் உற்பத்தி துவக்கம்",
            summary: "Electronic computing is approaching physical silicon limits. A quiet revolution in optoelectronics in Chennai is launching light-based quantum accelerators into industrial scale.",
            summary_ta: "மின்சார கணினி அமைப்புகள் சிலிக்கான் எல்லைகளை எட்டுகின்றன. சென்னையில் ஒளியியல் அடிப்படையிலான குவாண்டம் முடுக்கிகளின் உற்பத்தி துவங்கியுள்ளது.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
            category: "Technology",
            category_ta: "தொழில்நுட்பம்",
            author: "Dr. Aris Thorne",
            published_at: "2026-06-23T10:30:00Z",
            views: 41250,
            reading_time: 4,
            editors_pick: true,
            trending: true,
            district: "Chennai"
          },
          {
            id: "2",
            title: "Chennai Storm Alert: Regional Meteorological Centre Issues Red Alert for Coastal Districts",
            title_ta: "சென்னைக்கு ரெட் அலர்ட்: கடலோர மாவட்டங்களில் கனமழை எச்சரிக்கை",
            summary: "A deep depression in the Bay of Bengal has intensified into a cyclonic storm, heading towards the Tamil Nadu coast near Chennai.",
            summary_ta: "வங்கக் கடலில் உருவாகியுள்ள புதிய தீவிர காற்றழுத்தத் தாழ்வு மண்டலம் புயலாக மாறி, சென்னைக்கு அருகே கரையை கடக்க வாய்ப்புள்ளது.",
            image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80",
            category: "Tamil Nadu",
            category_ta: "தமிழ்நாடு",
            author: "P. Srinivasan",
            published_at: "2026-06-23T11:00:00Z",
            views: 32000,
            reading_time: 2,
            editors_pick: false,
            trending: true,
            district: "Chennai"
          },
          {
            id: "3",
            title: "TNEA engineering rank list to be announced on July 18",
            title_ta: "பொறியியல் படிப்புகளுக்கான தரவரிசைப் பட்டியல் ஜூலை 18-ல் வெளியீடு",
            summary: "Directorate of Technical Education in Chennai has confirmed the counseling schedules and verification dates for Tamil Nadu engineering aspirants.",
            summary_ta: "தமிழ்நாடு தொழில்நுட்பக் கல்வி இயக்ககம் பொறியியல் படிப்புகளுக்கான கலந்தாய்வு கால அட்டவணையை வெளியிட்டுள்ளது.",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
            category: "Education",
            category_ta: "கல்வி",
            author: "S. Murugan",
            published_at: "2026-06-22T08:15:00Z",
            views: 28400,
            reading_time: 3,
            editors_pick: true,
            trending: false,
            district: "Chennai"
          }
        ]);
      } finally {
        setLoading(false);
      }

      // Load user interests
      const savedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");
      setUserInterests(savedInterests);
    };

    loadHomepageData();
  }, []);

  // Filter articles based on user interests
  const recommendedArticles = articles.filter(art => 
    userInterests.some(interest => art.category.toLowerCase() === interest.toLowerCase())
  );

  const nonRecommendedArticles = articles.filter(art => 
    !userInterests.some(interest => art.category.toLowerCase() === interest.toLowerCase())
  );

  // Combine so recommended ones are at the top if interests exist
  const prioritizedArticles = userInterests.length > 0 
    ? [...recommendedArticles, ...nonRecommendedArticles] 
    : articles;

  const leftBriefs = prioritizedArticles.slice(1, 6);
  const centerFeatured = prioritizedArticles[0] || null;

  const getBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "politics":
      case "tamil nadu": 
        return "badge-politics";
      case "business": 
        return "badge-business";
      case "science": 
        return "badge-science";
      case "technology": 
        return "badge-technology";
      case "entertainment": 
      case "cinema": 
        return "badge-entertainment";
      default: 
        return "badge-politics";
    }
  };

  return (
    <main className="space-y-4 min-h-screen bg-white text-gray-900 transition-colors pb-12">
      
      {/* 1. Breaking News Ticker */}
      <BreakingNews />

      {/* 2. Editorial Header Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Links */}
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
          <Link href="/epaper" className="hover:text-[#d60000]">{t("epaperButton")}</Link>
          <span className="h-3.5 w-px bg-gray-200" />
          <Link href="/admin" className="hover:text-[#d60000]">{t("tvButton")}</Link>
        </div>

        {/* Center Logo branding */}
        <div className="text-center">
          <h1 className="serif-title text-4xl sm:text-5xl font-black tracking-tight text-[#003366] leading-none">
            {language === "ta" ? "குமரி செய்திகள்" : "KUMARI NEWS"}
          </h1>
          <span className="text-[10px] font-black tracking-widest uppercase text-[#d60000] block mt-2">
            {language === "ta" ? "தமிழகத்தின் குரல், எதிர்காலத்தின் பார்வை" : "Voice of Tamil Nadu, Vision of the Future"}
          </span>
        </div>

        {/* Right badging */}
        <div className="flex items-center gap-2">
          <a href="#" className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 font-bold text-[9px] flex items-center gap-1 hover:bg-gray-50 uppercase tracking-wide">
            <Smartphone className="w-3.5 h-3.5 text-[#d60000]" />
            <span>{t("appStore")}</span>
          </a>
          <a href="#" className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 font-bold text-[9px] flex items-center gap-1 hover:bg-gray-50 uppercase tracking-wide">
            <Monitor className="w-3.5 h-3.5 text-[#003366]" />
            <span>{t("playStore")}</span>
          </a>
        </div>
      </div>

      {/* 3. Local District Quick Nav Bar (Bilingual) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-gray-50 border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#003366] shrink-0 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#d60000]" />
            <span>{language === "ta" ? "மாவட்ட செய்திகள்:" : "District News Hub:"}</span>
          </span>
          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-650">
            {districts.map(dist => {
              const name = language === "ta" ? dist.name_ta : dist.name;
              return (
                <Link 
                  key={dist.name}
                  href={`/district/${dist.name.toLowerCase()}`}
                  className="px-2 py-1 bg-white border border-gray-150 rounded hover:border-[#d60000] hover:text-[#d60000] transition-colors shadow-sm"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Horizontal Sponsored Banner / Ad Space */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[80px] bg-[#f8f9fa] rounded border border-gray-200 flex items-center justify-center p-2 shadow-sm overflow-hidden relative">
          <div className="text-center">
            <span className="text-[8px] font-black text-gray-400 tracking-wider block uppercase mb-0.5">{t("sponsoredLabel")}</span>
            <span className="serif-title text-xs md:text-sm font-bold text-gray-900 tracking-tight">
              {language === "ta" ? "தமிழ்நாட்டின் கல்வி மற்றும் வேலைவாய்ப்பு காப்பகங்கள் • எளிய தேடல் வழிகாட்டி" : "EXPLORE TAMIL NADU EDUCATION AND JOBS PORTAL • LATEST VACANCIES SYNCED DAILY"}
            </span>
          </div>
          <a href="#" className="absolute right-4 text-[9px] font-bold text-[#d60000] flex items-center gap-0.5 hover:underline uppercase">
            <span>{t("detailsLabel")}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 5. Main Newspaper Layout Grid (3 Columns) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-gray-50 border border-gray-100 rounded">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d60000] border-t-transparent mx-auto" />
            <p className="text-xs font-bold text-gray-400">Formatting layout grids...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Column A: Left Column (3/12 wide) - Local Briefings / Recommended */}
            <section className="lg:col-span-3 space-y-6 lg:border-r lg:border-gray-200 pr-4">
              <div className="border-b-2 border-[#d60000] pb-1.5 mb-4">
                <h3 className="serif-title text-sm font-extrabold uppercase text-gray-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#d60000]" />
                  <span>{t("regionalBriefs")}</span>
                </h3>
              </div>
              
              {/* Regional list items */}
              <div className="space-y-4">
                {leftBriefs.map((art) => {
                  const title = language === "ta" ? art.title_ta : art.title;
                  const cat = language === "ta" ? art.category_ta : art.category;
                  const isRecommended = userInterests.some(i => art.category.toLowerCase() === i.toLowerCase());

                  return (
                    <div key={art.id} className="flex gap-3 group relative items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <img src={art.image} alt={title} className="w-16 h-12 rounded object-cover border border-gray-200 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider ${getBadgeClass(art.category)}`}>
                            {cat}
                          </span>
                          {isRecommended && (
                            <span className="text-[7px] font-black bg-amber-500 text-white px-1 py-0.2 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2 fill-white" />
                              <span>REC</span>
                            </span>
                          )}
                        </div>
                        
                        <h5 className="serif-title text-xs font-black leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                          <Link href={`/article/${art.id}`}>
                            <span className="absolute inset-0" />
                            {title}
                          </Link>
                        </h5>
                        <span className="text-[9px] font-semibold text-gray-400">{art.reading_time} {t("minRead")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Column B: Middle Column (5/12 wide) - Featured Focus */}
            <section className="lg:col-span-5 space-y-6">
              {centerFeatured && (
                <div className="space-y-4 group relative">
                  <div className="relative aspect-video w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
                    <img 
                      src={centerFeatured.image} 
                      alt={language === "ta" ? centerFeatured.title_ta : centerFeatured.title} 
                      className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-[#d60000] text-white">
                      {t("featuredHeadline")}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="text-[#003366]">{language === "ta" ? centerFeatured.category_ta : centerFeatured.category}</span>
                      <span>•</span>
                      <span>By {centerFeatured.author}</span>
                      {centerFeatured.district && (
                        <>
                          <span>•</span>
                          <span className="text-[#d60000]">{language === "ta" ? districtNameTranslations[centerFeatured.district.toLowerCase()] || centerFeatured.district : centerFeatured.district}</span>
                        </>
                      )}
                    </div>
                    
                    <h2 className="serif-title text-xl sm:text-2xl font-black text-gray-900 leading-snug group-hover:text-[#d60000] transition-colors">
                      <Link href={`/article/${centerFeatured.id}`}>
                        <span className="absolute inset-0" />
                        {language === "ta" ? centerFeatured.title_ta : centerFeatured.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 font-semibold">
                      {language === "ta" ? centerFeatured.summary_ta : centerFeatured.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Feed scroll area */}
              <div className="pt-6 border-t border-gray-200">
                <HomeFeed initialArticles={prioritizedArticles} />
              </div>
            </section>

            {/* Column C: Right Column (4/12 wide) - Local Widgets and E-Paper */}
            <section className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-200 pl-4">
              
              {/* E-Paper Widget */}
              <EpaperWidget />

              {/* Local weather updates */}
              <WeatherWidget />

              {/* Financial panel rates */}
              <RatesWidget />

              {/* Live sports matcher */}
              <SportsWidget />

              {/* Jobs notification alerts */}
              <JobAlertsWidget />

              {/* Academic Education alerts */}
              <EducationWidget />

            </section>

          </div>
        )}
      </div>

      {/* 6. Translation labels cache lookup helper */}
      {/* (For dynamic district translations inside client context) */}
      <span className="hidden">
        {Object.entries(districtNameTranslations).map(([k,v])=> (
          <span key={k} id={`dist-${k}`}>{v}</span>
        ))}
      </span>

    </main>
  );
}

const districtNameTranslations: Record<string, string> = {
  chennai: "சென்னை",
  madurai: "மதுரை",
  coimbatore: "கோயம்புத்தூர்",
  trichy: "திருச்சி",
  salem: "சேலம்",
  erode: "ஈரோடு",
  tirunelveli: "திருநெல்வேலி",
  ramanathapuram: "இராமநாதபுரம்",
  kanyakumari: "கன்னியாகுமரி",
  thoothukudi: "தூத்துக்குடி",
  vellore: "வேலூர்"
};
