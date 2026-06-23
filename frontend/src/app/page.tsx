"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Star, TrendingUp, Mail, Play,
  Smartphone, Monitor, ExternalLink, Globe, ChevronRight, MapPin,
  Clock, Eye, Video
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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

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

// Reusable Image component that handles load errors and empty states gracefully
function SafeImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
      className={className}
      loading="lazy"
    />
  );
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  // Interactive district filtering state
  const [selectedDistrict, setSelectedDistrict] = useState("Chennai");

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

  // Extract featured articles
  const centerFeatured = prioritizedArticles[0] || null;
  const secondaryFeatured = prioritizedArticles.slice(1, 4); // 3 items
  const latestArticles = prioritizedArticles.slice(4);

  // Filter articles by active district
  const districtArticles = articles.filter(
    (art) => art.district?.toLowerCase() === selectedDistrict.toLowerCase()
  );

  // Filter trending articles
  const trendingArticles = articles.filter((art) => art.trending).slice(0, 5);

  // Simulated Video news bulletins
  const videoArticles = articles.slice(0, 3);

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
    <main className="space-y-8 min-h-screen bg-white text-gray-900 transition-colors pb-16">
      
      {/* 1. Breaking News Ticker (Full Width) */}
      <BreakingNews />

      {/* 2. Editorial Header Bar (Widescreen 1600px) */}
      <div className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Links */}
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
          <Link href="/epaper" className="hover:text-[#d60000]">{t("epaperButton")}</Link>
          <span className="h-3.5 w-px bg-gray-200" />
          <Link href="/admin" className="hover:text-[#d60000]">{t("tvButton")}</Link>
        </div>

        {/* Center Logo branding */}
        <div className="text-center">
          <h1 className="serif-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#003366] leading-none">
            {language === "ta" ? "குமரி செய்திகள்" : "KUMARI NEWS"}
          </h1>
          <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-[#d60000] block mt-2">
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

      {/* 3. Local District Quick Nav Bar (Widescreen) */}
      <div className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 border border-gray-200 rounded p-4 flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#003366] shrink-0 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#d60000]" />
            <span>{language === "ta" ? "மாவட்ட செய்திகள்:" : "District News Hub:"}</span>
          </span>
          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-655">
            {districts.map(dist => {
              const name = language === "ta" ? dist.name_ta : dist.name;
              return (
                <button 
                  key={dist.name}
                  onClick={() => setSelectedDistrict(dist.name)}
                  className={`px-3 py-1.5 rounded transition-all shadow-sm font-bold border ${
                    selectedDistrict.toLowerCase() === dist.name.toLowerCase()
                      ? "bg-[#003366] border-[#003366] text-white"
                      : "bg-white border-gray-200 hover:border-[#d60000] hover:text-[#d60000] text-gray-700"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Hero Section (Visual Hierarchy Item 1) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-gray-50 border border-gray-100 rounded">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d60000] border-t-transparent mx-auto" />
            <p className="text-xs font-bold text-gray-400">Loading features...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (8/12 wide) - Huge Featured Story */}
              <div className="lg:col-span-8 group relative flex flex-col justify-between">
                {centerFeatured && (
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-md">
                      <SafeImg 
                        src={centerFeatured.image} 
                        alt={language === "ta" ? centerFeatured.title_ta : centerFeatured.title} 
                        className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded text-[9px] font-black tracking-wider uppercase bg-[#d60000] text-white shadow-md">
                        {t("featuredHeadline")}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                          {language === "ta" ? centerFeatured.category_ta : centerFeatured.category}
                        </span>
                        <span>•</span>
                        <span>By {centerFeatured.author}</span>
                        {centerFeatured.district && (
                          <>
                            <span>•</span>
                            <span className="text-[#d60000] font-black">{language === "ta" ? districtNameTranslations[centerFeatured.district.toLowerCase()] || centerFeatured.district : centerFeatured.district}</span>
                          </>
                        )}
                      </div>
                      
                      <h2 className="serif-title text-3xl sm:text-4xl font-black text-gray-900 leading-tight group-hover:text-[#d60000] transition-colors">
                        <Link href={`/article/${centerFeatured.id}`}>
                          <span className="absolute inset-0" />
                          {language === "ta" ? centerFeatured.title_ta : centerFeatured.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-655 text-sm leading-relaxed line-clamp-3 font-medium">
                        {language === "ta" ? centerFeatured.summary_ta : centerFeatured.summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (4/12 wide) - Secondary Featured Stories */}
              <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{language === "ta" ? "முன்னணி செய்திகள்" : "Leading Focus"}</span>
                  </h3>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between py-2">
                  {secondaryFeatured.map((art) => {
                    const title = language === "ta" ? art.title_ta : art.title;
                    const cat = language === "ta" ? art.category_ta : art.category;
                    return (
                      <div key={art.id} className="flex gap-4 group relative items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0 h-full">
                        <div className="w-24 h-16 rounded overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                          <SafeImg src={art.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="space-y-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${getBadgeClass(art.category)}`}>
                            {cat}
                          </span>
                          <h4 className="serif-title text-sm font-bold leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                            <Link href={`/article/${art.id}`}>
                              <span className="absolute inset-0" />
                              {title}
                            </Link>
                          </h4>
                          <span className="text-[9px] font-semibold text-gray-400">{art.reading_time} {t("minRead")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 5. Horizontal Banner Ad Space (Widescreen) */}
      <div className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[90px] bg-[#f8f9fa] rounded border border-gray-200 flex items-center justify-center p-4 shadow-sm overflow-hidden relative">
          <div className="text-center">
            <span className="text-[8px] font-black text-gray-400 tracking-wider block uppercase mb-1">{t("sponsoredLabel")}</span>
            <span className="serif-title text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              {language === "ta" ? "தமிழ்நாட்டின் கல்வி மற்றும் வேலைவாய்ப்பு காப்பகங்கள் • எளிய தேடல் வழிகாட்டி" : "EXPLORE TAMIL NADU EDUCATION AND JOBS PORTAL • LATEST VACANCIES SYNCED DAILY"}
            </span>
          </div>
          <a href="#" className="absolute right-6 text-[9px] font-bold text-[#d60000] flex items-center gap-0.5 hover:underline uppercase">
            <span>{t("detailsLabel")}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 6. Latest News (Visual Hierarchy Item 2) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b-2 border-[#d60000] pb-2 flex items-center justify-between">
          <h3 className="serif-title text-lg font-black uppercase text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#d60000]" />
            <span>{language === "ta" ? "சமீபத்திய செய்திகள்" : "Latest Reports"}</span>
          </h3>
          <span className="text-xs text-gray-400 font-semibold">{t("allBriefings")}</span>
        </div>

        {/* 3-column feed component */}
        <HomeFeed initialArticles={latestArticles} />
      </section>

      {/* 7. Dynamic District News bulletins (Visual Hierarchy Item 3) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b-2 border-[#003366] pb-2 flex items-center justify-between">
          <h3 className="serif-title text-lg font-black uppercase text-[#003366] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d60000]" />
            <span>
              {language === "ta" 
                ? `மாவட்ட செய்திகள் - ${districtNameTranslations[selectedDistrict.toLowerCase()] || selectedDistrict}`
                : `${selectedDistrict} Regional Bulletins`
              }
            </span>
          </h3>
          <Link href={`/district/${selectedDistrict.toLowerCase()}`} className="text-xs font-bold text-[#d60000] hover:underline flex items-center">
            <span>{language === "ta" ? "அனைத்தையும் காண்க" : "View All"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* District meteorological banner warnings */}
        {selectedDistrict.toLowerCase() === "chennai" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
            <span className="animate-pulse">🚨</span>
            <span>{language === "ta" ? "சென்னை வானிலை மையம் எச்சரிக்கை: கடலோர சென்னைக்கு கனமழை மற்றும் ரெட் அலர்ட்." : "Chennai Storm Alert: Heavy rains predicted with active red alert in coastal areas."}</span>
          </div>
        )}
        {selectedDistrict.toLowerCase() === "kanyakumari" && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
            <span>⚠️</span>
            <span>{language === "ta" ? "கடல் எச்சரிக்கை: மீனவர்கள் ஆழ்கடலுக்குச் செல்ல வேண்டாம் என அறிவுறுத்தப்பட்டுள்ளது." : "Rough Sea Advisory: Fishermen are advised not to venture into deep sea."}</span>
          </div>
        )}

        {/* District list grid */}
        {districtArticles.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 bg-gray-50 border border-gray-150 rounded">
            {t("noLocalNews")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {districtArticles.slice(0, 3).map((art) => {
              const title = language === "ta" ? art.title_ta : art.title;
              const summary = language === "ta" ? art.summary_ta : art.summary;
              const cat = language === "ta" ? art.category_ta : art.category;
              return (
                <article key={art.id} className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 min-h-[350px]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 border-b border-gray-200">
                    <SafeImg src={art.image} alt={title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-350" />
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getBadgeClass(art.category)}`}>
                      {cat}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span>{art.author}</span>
                      <span>•</span>
                      <span>{new Date(art.published_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="serif-title text-base font-extrabold leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                      <Link href={`/article/${art.id}`}>
                        <span className="absolute inset-0" />
                        {title}
                      </Link>
                    </h4>
                    <p className="text-gray-655 text-xs leading-relaxed line-clamp-2 font-semibold">{summary}</p>
                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#003366]" />
                        <span>{art.reading_time} {t("minRead")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{(art.views || 0).toLocaleString()} {t("views")}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 8. Trending & Videos Section (Visual Hierarchy Item 4 & 5) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left Column (5/12 wide) - Trending News */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b-2 border-[#d60000] pb-2">
            <h3 className="serif-title text-lg font-black uppercase text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#d60000]" />
              <span>{language === "ta" ? "மக்களிடையே பிரபலம்" : "Trending Analysis"}</span>
            </h3>
          </div>

          <div className="divide-y divide-gray-150 border border-gray-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
            {trendingArticles.map((art, index) => {
              const title = language === "ta" ? art.title_ta : art.title;
              return (
                <div key={art.id} className="pt-4 first:pt-0 group relative flex gap-3 items-start h-full pb-4 last:pb-0">
                  <span className="serif-title text-3xl font-black text-gray-200 group-hover:text-[#d60000] transition-colors shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h4 className="serif-title text-sm font-extrabold leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                      <Link href={`/article/${art.id}`}>
                        <span className="absolute inset-0" />
                        {title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400">
                      <span className="text-[#003366] uppercase">{language === "ta" ? art.category_ta : art.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{(art.views || 0).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7/12 wide) - Video bulletins */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b-2 border-[#003366] pb-2">
            <h3 className="serif-title text-lg font-black uppercase text-[#003366] flex items-center gap-2">
              <Video className="w-5 h-5 text-[#d60000]" />
              <span>{language === "ta" ? "வீடியோ செய்திகள்" : "Video Reports"}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videoArticles.map((art) => {
              const title = language === "ta" ? art.title_ta : art.title;
              return (
                <div key={art.id} className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-full hover:shadow-md transition-all">
                  <div className="relative aspect-video w-full bg-gray-50 overflow-hidden">
                    <SafeImg src={art.image} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-90 group-hover:bg-black/45 transition-colors">
                      <div className="p-3 bg-white/90 group-hover:bg-white text-[#d60000] rounded-full shadow-lg transition-transform transform group-hover:scale-110">
                        <Play className="w-4 h-4 fill-[#d60000]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="serif-title text-xs font-black text-gray-900 group-hover:text-[#d60000] transition-colors leading-snug line-clamp-2">
                      <Link href={`/article/${art.id}`}>
                        <span className="absolute inset-0" />
                        {title}
                      </Link>
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 9. Jobs & Education Hub (Visual Hierarchy Item 6 & 7) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Left: Job Alerts Widget */}
        <div className="space-y-4 bg-[#f8f9fa] border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="serif-title text-base font-black text-[#003366] flex items-center justify-between">
              <span>{language === "ta" ? "வேலைவாய்ப்பு செய்திகள்" : "Job Alerts Board"}</span>
              <Link href="/jobs" className="text-[10px] font-black uppercase text-[#d60000] hover:underline flex items-center">
                <span>{language === "ta" ? "மேலும் காண்க" : "Explore Board"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </h3>
          </div>
          <JobAlertsWidget />
        </div>

        {/* Right: Education Updates */}
        <div className="space-y-4 bg-[#f8f9fa] border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="serif-title text-base font-black text-[#003366] flex items-center justify-between">
              <span>{language === "ta" ? "கல்விச் செய்திகள்" : "Academic Education Bulletin"}</span>
              <Link href="/education" className="text-[10px] font-black uppercase text-[#d60000] hover:underline flex items-center">
                <span>{language === "ta" ? "மேலும் காண்க" : "Explore Board"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </h3>
          </div>
          <EducationWidget />
        </div>

      </section>

      {/* 10. Bottom Utilities Board - E-paper, Weather, Rates, Sports (Visual Hierarchy Item 8) */}
      <section className="mx-auto max-w-[1600px] w-[90%] px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b-2 border-gray-200 pb-2 mb-6">
          <h3 className="serif-title text-lg font-black uppercase text-gray-900">
            {language === "ta" ? "வானிலை, வர்த்தகம் & இதர சேவைகள்" : "Weather, Rates & Sports utilities"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Item 1: E-paper archives */}
          <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <EpaperWidget />
          </div>

          {/* Item 2: Weather updates */}
          <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <WeatherWidget />
          </div>

          {/* Item 3: Financial Panel */}
          <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <RatesWidget />
          </div>

          {/* Item 4: Live sports match score */}
          <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <SportsWidget />
          </div>
        </div>
      </section>

      {/* 11. Hidden Translation labels cache lookup helper */}
      <span className="hidden">
        {Object.entries(districtNameTranslations).map(([k,v])=> (
          <span key={k} id={`dist-${k}`}>{v}</span>
        ))}
      </span>

    </main>
  );
}
