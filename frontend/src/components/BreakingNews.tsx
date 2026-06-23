"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TickerItem {
  id: string;
  title: string;
  title_ta: string;
  category: string;
  category_ta: string;
}

export default function BreakingNews() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/articles?trending=true");
        if (res.ok) {
          const data = await res.json();
          setItems(data.map((art: any) => ({
            id: art.id,
            title: art.title,
            title_ta: art.title_ta || art.title,
            category: art.category,
            category_ta: art.category_ta || art.category
          })));
        }
      } catch (err) {
        setItems([
          { 
            id: "1", 
            title: "Quantum Photonic Accelerators Enter Commercial Production in Tamil Nadu Fab", 
            title_ta: "குவாண்டம் ஃபோட்டானிக் முடுக்கிகள் வணிகமயமாக்கல்: தமிழகத்தில் உற்பத்தி துவக்கம்", 
            category: "Technology",
            category_ta: "தொழில்நுட்பம்"
          },
          { 
            id: "2", 
            title: "Chennai Storm Alert: Regional Meteorological Centre Issues Red Alert for Coastal Districts", 
            title_ta: "சென்னைக்கு ரெட் அலர்ட்: கடலோர மாவட்டங்களில் கனமழை எச்சரிக்கை", 
            category: "Tamil Nadu",
            category_ta: "தமிழ்நாடு"
          }
        ]);
      }
    };

    fetchTrending();
  }, []);

  if (items.length === 0) return null;

  const displayItems = [...items, ...items, ...items];
  const breakingLabel = language === "ta" ? "அவசர செய்தி" : "Breaking";

  return (
    <div className="w-full bg-[#d60000] text-white py-2 overflow-hidden relative flex items-center shadow-sm">
      {/* Label Badge (Dark Blue accent) */}
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-[#003366] text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 z-10 select-none">
        <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
        <span>{breakingLabel}</span>
      </div>

      {/* Marquee Wrapper */}
      <div className="w-full flex pl-[110px] relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 select-none font-semibold text-xs">
          {displayItems.map((item, idx) => {
            const displayTitle = language === "ta" ? item.title_ta : item.title;
            const displayCategory = language === "ta" ? item.category_ta : item.category;

            return (
              <Link 
                key={`${item.id}-${idx}`} 
                href={`/article/${item.id}`}
                className="inline-flex items-center gap-2 hover:text-red-100 transition-colors"
              >
                <span className="px-2 py-0.5 rounded text-[8px] font-black bg-white/20 text-white uppercase tracking-wider">
                  {displayCategory}
                </span>
                <span className="text-white">{displayTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 inline ml-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
