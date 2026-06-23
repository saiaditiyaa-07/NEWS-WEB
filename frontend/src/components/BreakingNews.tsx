"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";

interface TickerItem {
  id: string;
  title: string;
  category: string;
}

export default function BreakingNews() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/articles?trending=true");
        if (res.ok) {
          const data = await res.json();
          setItems(data.map((art: any) => ({
            id: art.id,
            title: art.title,
            category: art.category
          })));
        }
      } catch (err) {
        setItems([
          { id: "1", title: "Silicon Photonics: Light-based quantum computing chips enter commercial fab production", category: "Technology" },
          { id: "2", title: "Biologists extract DNA-repair enzymes from Marianas extremophiles targeting age-reversal", category: "Science" },
          { id: "6", title: "High-Temperature Superconducting Magnets stabilize nuclear fusion plasma for 10.5 hours", category: "Technology" }
        ]);
      }
    };

    fetchTrending();
  }, []);

  if (items.length === 0) return null;

  const displayItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#d60000] text-white py-2 overflow-hidden relative flex items-center shadow-sm">
      {/* Label Badge (Dark Blue accent) */}
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-[#003366] text-xs font-black tracking-widest uppercase flex items-center gap-1.5 z-10">
        <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
        <span>Breaking</span>
      </div>

      {/* Marquee Wrapper */}
      <div className="w-full flex pl-[95px] relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 select-none">
          {displayItems.map((item, idx) => (
            <Link 
              key={`${item.id}-${idx}`} 
              href={`/article/${item.id}`}
              className="inline-flex items-center gap-2 hover:text-red-100 transition-colors text-xs font-bold"
            >
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-white/20 text-white uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-white tracking-wide">{item.title}</span>
              <Sparkles className="w-3 h-3 text-amber-300 inline ml-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
