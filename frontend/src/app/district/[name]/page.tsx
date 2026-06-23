import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, AlertCircle, Info, Calendar } from "lucide-react";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import ArticleCard from "@/components/ArticleCard";

interface DistrictPageProps {
  params: Promise<{ name: string }>;
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

// District alert fallbacks
const districtAlerts: Record<string, { alert: string; alert_ta: string }> = {
  chennai: {
    alert: "Heavy rainfall warning for suburban zones over next 24 hours.",
    alert_ta: "அடுத்த 24 மணிநேரத்திற்கு புறநகர் பகுதிகளில் கனமழை எச்சரிக்கை."
  },
  kanyakumari: {
    alert: "Rough sea warning: Fishermen advised not to venture into deep sea.",
    alert_ta: "மீனவர்கள் ஆழ்கடலுக்குள் செல்ல வேண்டாம் என கடல் சீற்ற எச்சரிக்கை விடுக்கப்பட்டுள்ளது."
  },
  ramanathapuram: {
    alert: "High tide winds along coastal corridors.",
    alert_ta: "கடற்கரை ஓரங்களில் பலத்த காற்று வீசக்கூடும்."
  }
};

const localEventsList: Record<string, { event: string; event_ta: string; date: string }[]> = {
  chennai: [
    { event: "Metro water distribution optimization meeting at Corporation Hall", event_ta: "சென்னை மாநகராட்சி மன்றத்தில் குடிநீர் விநியோகம் குறித்த கூட்டம்", date: "June 25, 2026" },
    { event: "Tamil literature conference at Valluvar Kottam", event_ta: "வள்ளுவர் கோட்டத்தில் தமிழ் இலக்கிய மாநாடு", date: "June 28, 2026" }
  ],
  madurai: [
    { event: "Annual temple festival procession planning assembly", event_ta: "சித்திரைத் திருவிழா ஊர்வலக் குழுவின் திட்டமிடல் கூட்டம்", date: "June 26, 2026" }
  ],
  coimbatore: [
    { event: "Organic farming products expo at VOC Ground", event_ta: "வ.உ.சி மைதானத்தில் இயற்கை விவசாயப் பொருட்கள் கண்காட்சி", date: "June 27, 2026" }
  ]
};

async function getDistrictArticles(districtName: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/articles?district=${districtName}`);
    if (res.ok) {
      return await res.ok ? res.json() : [];
    }
    throw new Error();
  } catch (err) {
    // Fallback static matches
    return [];
  }
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const resolvedParams = await params;
  const nameInput = resolvedParams.name;
  const key = nameInput.toLowerCase();
  
  const nameEn = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
  const nameTa = districtNameTranslations[key] || nameEn;
  
  const articles = await getDistrictArticles(key);
  const alert = districtAlerts[key] || null;
  const events = localEventsList[key] || [
    { event: "Local welfare society development meet", event_ta: "உள்ளூர் பொது நலச் சங்கக் கூட்டம்", date: "June 26, 2026" }
  ];

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
        
        {/* Left Column (8 cols): Local News Bulletins */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#d60000] block">District Bulletin Center</span>
                <h1 className="serif-title text-2xl font-black text-[#003366] flex items-center gap-1.5">
                  <MapPin className="w-6 h-6 text-[#d60000]" />
                  <span>{nameEn} / {nameTa}</span>
                </h1>
              </div>
              <span className="px-3 py-1 bg-red-50 border border-red-100 text-[10px] font-black text-red-700 uppercase tracking-widest rounded-full">
                Live Local Updates
              </span>
            </div>

            {/* Weather Alerts if any */}
            {alert && (
              <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-750 font-bold rounded flex gap-2 items-start uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-[#d60000] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-black text-[#d60000]">Emergency Meteorology Alert:</span>
                  <p className="normal-case leading-relaxed font-semibold">{alert.alert} / {alert.alert_ta}</p>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="space-y-6 pt-4">
              <h3 className="serif-title text-sm font-extrabold uppercase text-gray-800 border-b border-gray-150 pb-2">
                Latest Community Reports ({articles.length})
              </h3>
              
              {articles.length === 0 ? (
                <div className="p-12 border border-dashed border-gray-200 rounded text-center space-y-2">
                  <Info className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-400">No active bulletins for {nameEn} district database.</p>
                  <p className="text-[10px] text-gray-500 max-w-xs mx-auto">Create and tag articles with "{nameEn}" in the admin portal to see them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {articles.map((art: any) => (
                    <ArticleCard key={art.id} article={art} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Column (4 cols): Meteorology & Local Info */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Local Weather Widget */}
          <WeatherWidget initialCity={nameEn} />

          {/* Local Community Events Widget */}
          <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4">
            <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] border-b border-gray-150 pb-2">
              Community Calendar
            </h4>
            
            <div className="space-y-4">
              {events.map((ev, idx) => (
                <div key={idx} className="space-y-2 text-xs font-semibold leading-relaxed border-b border-dashed border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex gap-1.5 items-center text-[9px] font-black text-gray-400 uppercase">
                    <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                    <span>{ev.date}</span>
                  </div>
                  <h5 className="font-extrabold text-gray-850">{ev.event}</h5>
                  <p className="text-[10px] text-gray-500 font-bold">{ev.event_ta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Contacts */}
          <div className="p-5 bg-[#003366] text-white border border-blue-900 rounded shadow-sm space-y-3">
            <span className="text-[8px] font-black uppercase tracking-widest text-red-300">Helplines & Disaster Desk</span>
            <h4 className="serif-title text-xs font-black uppercase tracking-widest">District Control Rooms</h4>
            <ul className="space-y-2 text-[10px] font-black uppercase tracking-wider pt-2 border-t border-blue-800">
              <li className="flex justify-between">
                <span>District Disaster Management:</span>
                <span className="text-red-300">1077</span>
              </li>
              <li className="flex justify-between">
                <span>State Control Room:</span>
                <span className="text-red-300">1070</span>
              </li>
              <li className="flex justify-between">
                <span>Fire & Rescue Services:</span>
                <span className="text-red-300">101</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>

    </div>
  );
}
