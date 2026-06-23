"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Eye, Calendar, Newspaper, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EpaperItem {
  id: string;
  date: string;
  pdf_url: string;
  thumbnail: string;
}

export default function EpaperPage() {
  const { language, t } = useLanguage();
  const [papers, setPapers] = useState<EpaperItem[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<EpaperItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpaper = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/epaper");
        if (res.ok) {
          const data = await res.json();
          setPapers(data);
          if (data.length > 0) {
            setSelectedPaper(data[0]);
          }
        }
      } catch (err) {
        const fallback = [
          { id: "e1", date: "2026-06-23", pdf_url: "/mock-epaper.pdf", thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80" },
          { id: "e2", date: "2026-06-22", pdf_url: "/mock-epaper.pdf", thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80" },
          { id: "e3", date: "2026-06-21", pdf_url: "/mock-epaper.pdf", thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80" }
        ];
        setPapers(fallback);
        setSelectedPaper(fallback[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchEpaper();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d60000] border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-gray-400">Loading digital archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-[#F8F9FA] text-gray-900">
      
      {/* Return Back */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#d60000] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 text-[#d60000]" />
          <span>Back to Home Feed</span>
        </Link>
      </div>

      {/* Main layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Digital Print Reader Viewer Mock */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm space-y-4">
            
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#d60000] block">{t("digitalEdition")}</span>
                <h1 className="serif-title text-2xl font-black text-[#003366] flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-[#d60000]" />
                  <span>{language === "ta" ? "குமரி நாளிதழ்" : "Kumari News e-Paper"}</span>
                </h1>
              </div>
              
              {selectedPaper && (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 block uppercase">ACTIVE DATE</span>
                    <span className="text-xs font-bold text-gray-800">{selectedPaper.date}</span>
                  </div>
                  <a 
                    href={selectedPaper.pdf_url} 
                    download 
                    className="px-4 py-2 bg-[#d60000] hover:bg-[#b50000] text-white font-bold text-xs uppercase tracking-wider rounded shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t("downloadPdf")}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mock Print Sheet Preview Display */}
            {selectedPaper ? (
              <div className="border border-gray-200 rounded bg-gray-50 p-4 relative overflow-hidden flex justify-center items-center group max-h-[600px]">
                <div className="aspect-[3/4] w-full max-w-[450px] bg-white shadow-xl rounded border border-gray-300 relative overflow-hidden flex flex-col">
                  {/* Top brand banner inside ePaper mock */}
                  <div className="bg-[#003366] text-white p-3 text-center border-b-2 border-[#d60000]">
                    <span className="serif-title font-black tracking-tighter text-sm uppercase">KUMARI NEWS</span>
                    <p className="text-[6px] tracking-widest uppercase mt-0.5 opacity-80">{selectedPaper.date}</p>
                  </div>

                  {/* Body text columns mock */}
                  <div className="flex-1 p-4 grid grid-cols-3 gap-2 overflow-hidden text-[6px] font-semibold text-gray-400 leading-normal pointer-events-none select-none">
                    <div className="space-y-1 border-r border-gray-100 pr-2">
                      <div className="h-3 bg-[#d60000]/10 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-250 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-20 bg-gray-100 rounded w-full my-2"></div>
                      <p>Breaking local developments in southern corridors trigger massive logistics shifts. Local authorities deploy emergency systems to monitor water corridors.</p>
                    </div>
                    <div className="space-y-1 border-r border-gray-100 px-2">
                      <div className="h-3 bg-[#003366]/10 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-250 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      <p>Special economic policies set for agricultural trade hubs. TNEA counselling deadlines updated with rank announcements scheduled for mid-July. Farmers celebrate local dam updates.</p>
                      <div className="h-20 bg-gray-100 rounded w-full my-2"></div>
                    </div>
                    <div className="space-y-1 pl-2">
                      <div className="h-3 bg-emerald-500/10 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-250 rounded w-5/6"></div>
                      <p>Regional Met Centre alerts local fishermen along Ramanathapuram beaches due to high coastal swells. Navy deployment plans activated for coastal surveillance.</p>
                    </div>
                  </div>

                  {/* Watermark cover overlay */}
                  <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={selectedPaper.pdf_url} 
                      download 
                      className="px-5 py-3 bg-white text-gray-800 border border-gray-200 shadow-2xl rounded font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:text-[#d60000]"
                    >
                      <Download className="w-4 h-4 text-[#d60000]" />
                      <span>{t("downloadPdf")}</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 border border-dashed border-gray-300 rounded text-center">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 mt-2 font-semibold">No active edition loaded.</p>
              </div>
            )}

          </div>
        </main>

        {/* Right Column (4 cols): Archive Sheets */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 border border-gray-200 rounded shadow-sm space-y-4">
            <h3 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] border-b border-gray-150 pb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#d60000]" />
              <span>{language === "ta" ? "முந்தைய பதிப்புகள்" : "Archive Editions"}</span>
            </h3>

            <div className="space-y-2.5">
              {papers.map((p) => {
                const isActive = selectedPaper?.id === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPaper(p)}
                    className={`p-3 rounded border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      isActive 
                        ? "border-[#003366] bg-blue-50/20 text-[#003366]" 
                        : "border-gray-100 hover:border-gray-300 bg-gray-50/30 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className={`w-4 h-4 ${isActive ? "text-[#d60000]" : "text-gray-400"}`} />
                      <span>{p.date}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-0.5">
                      <span>{isActive ? "Viewing" : "Select"}</span>
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-2 text-xs font-semibold leading-relaxed text-gray-650">
            <h5 className="font-extrabold text-gray-800 text-[10px] font-black uppercase tracking-wider">{language === "ta" ? "காப்பக அறிவிப்பு" : "Archive Policy"}</h5>
            <p>Kumari News Digital Print publishes daily at 05:00 AM IST. Past editions are maintained in online index storage for up to 30 days. For archival requests beyond 30 days, please contact the print circulation desk.</p>
          </div>
        </aside>

      </div>

    </div>
  );
}
