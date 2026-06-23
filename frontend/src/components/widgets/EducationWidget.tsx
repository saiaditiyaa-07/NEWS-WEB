"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EducationData {
  updates: string[];
  updates_ta: string[];
}

export default function EducationWidget() {
  const { language, t } = useLanguage();
  const [edu, setEdu] = useState<EducationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdu = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/education");
        if (res.ok) {
          const data = await res.json();
          setEdu(data);
        }
      } catch (err) {
        setEdu({
          updates: [
            "NEET 2026: Counseling procedures for medical seats set to start next week",
            "JEE Advanced: Answer keys published; objections window open till Friday",
            "TNEA Counseling guidelines issued; TNEA engineering rank list on July 18th"
          ],
          updates_ta: [
            "நீட் 2026: மருத்துவ இடங்களுக்கான கலந்தாய்வு அடுத்த வாரம் தொடங்குகிறது",
            "ஜே.இ.இ அட்வான்ஸ்டு: விடைக்குறிப்புகள் வெளியீடு; வெள்ளிக்கிழமை வரை ஆட்சேபனை தெரிவிக்கலாம்",
            "டி.என்.இ.ஏ கலந்தாய்வு வழிகாட்டுதல்கள் வெளியீடு; ஜூலை 18-ல் பொறியியல் தரவரிசைப் பட்டியல்"
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEdu();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const activeUpdates = edu || { updates: [], updates_ta: [] };
  const list = language === "ta" ? activeUpdates.updates_ta : activeUpdates.updates;

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-[#d60000]" />
          <span>{t("educationAlert")}</span>
        </h4>
        <Link href="/education" className="text-[9px] font-black text-[#d60000] hover:underline uppercase tracking-wide">
          {language === "ta" ? "அனைத்தும்" : "All"}
        </Link>
      </div>

      <ul className="space-y-3">
        {list.slice(0, 3).map((item, idx) => (
          <li key={idx} className="text-[11px] font-semibold text-gray-700 leading-relaxed border-b border-dashed border-gray-100 pb-2.5 last:border-b-0 last:pb-0">
            <Link href="/education" className="hover:text-blue-700">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
