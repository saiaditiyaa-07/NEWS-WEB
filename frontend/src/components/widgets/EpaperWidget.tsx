"use client";

import React, { useState, useEffect } from "react";
import { FileDown, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EpaperItem {
  id: string;
  date: string;
  pdf_url: string;
  thumbnail: string;
}

export default function EpaperWidget() {
  const { language, t } = useLanguage();
  const [papers, setPapers] = useState<EpaperItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpaper = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/epaper");
        if (res.ok) {
          const data = await res.json();
          setPapers(data);
        }
      } catch (err) {
        setPapers([
          {
            id: "e1",
            date: new Date().toISOString().split("T")[0],
            pdf_url: "/mock-epaper.pdf",
            thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=80"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEpaper();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const activePaper = papers[0] || {
    id: "e1",
    date: new Date().toISOString().split("T")[0],
    pdf_url: "/mock-epaper.pdf",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=80"
  };

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#d60000]" />
          <span>{t("epaperTitle")}</span>
        </h4>
        <Link href="/epaper" className="text-[9px] font-black text-[#d60000] hover:underline uppercase tracking-wide">
          {language === "ta" ? "முழு பதிப்பு" : "Full View"}
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded overflow-hidden shadow-sm shrink-0">
          <img src={activePaper.thumbnail} alt="ePaper cover" className="w-full h-full object-cover" />
        </div>
        
        <div className="space-y-2">
          <div className="space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 block">{language === "ta" ? "இன்றைய பதிப்பு" : "TODAY'S PRINT EDITION"}</span>
            <h5 className="font-extrabold text-xs text-gray-800">{activePaper.date}</h5>
          </div>

          <div className="flex gap-2">
            <Link 
              href="/epaper"
              className="px-2.5 py-1 text-[9px] font-black uppercase bg-[#003366] text-white hover:bg-blue-900 rounded tracking-wider shadow-sm"
            >
              {language === "ta" ? "படிக்க" : "Read"}
            </Link>
            <a 
              href={activePaper.pdf_url} 
              download 
              className="p-1 border border-gray-200 hover:border-[#d60000] text-gray-500 hover:text-[#d60000] rounded transition-colors bg-white flex items-center justify-center"
              title={t("downloadPdf")}
            >
              <FileDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
