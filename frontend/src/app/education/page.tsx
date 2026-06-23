"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, FileSpreadsheet, Award } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EducationData {
  updates: string[];
  updates_ta: string[];
}

export default function EducationPage() {
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
            "TNEA Counseling guidelines issued; TNEA engineering rank list on July 18th",
            "Anna University announces undergraduate semester exams dates from November 10"
          ],
          updates_ta: [
            "நீட் 2026: மருத்துவ இடங்களுக்கான கலந்தாய்வு அடுத்த வாரம் தொடங்குகிறது",
            "ஜே.இ.இ அட்வான்ஸ்டு: விடைக்குறிப்புகள் வெளியீடு; வெள்ளிக்கிழமை வரை ஆட்சேபனை தெரிவிக்கலாம்",
            "டி.என்.இ.ஏ கலந்தாய்வு வழிகாட்டுதல்கள் வெளியீடு; ஜூலை 18-ல் பொறியியல் தரவரிசைப் பட்டியல்",
            "அண்ணா பல்கலைக்கழகம்: இளங்கலை செமஸ்டர் தேர்வுகள் நவம்பர் 10 முதல் தொடங்கும் என அறிவிப்பு"
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
      <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d60000] border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-gray-400">Loading academic portals...</p>
        </div>
      </div>
    );
  }

  const activeEdu = edu || { updates: [], updates_ta: [] };
  const list = language === "ta" ? activeEdu.updates_ta : activeEdu.updates;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-[#F8F9FA] text-gray-900">
      
      {/* Return Navigation */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#d60000] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 text-[#d60000]" />
          <span>Back to Home Feed</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5 mb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#d60000] block">Academic Information Hub</span>
        <h1 className="serif-title text-2xl font-black text-[#003366] flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#d60000]" />
          <span>{language === "ta" ? "கல்விச் செய்திகள்" : "Education & Examinations Portal"}</span>
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Stay updated with NEET/JEE entrance criteria, engineering admissions counseling, and state board announcements.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Circular Updates List */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm space-y-4">
            <h3 className="serif-title text-sm font-extrabold uppercase text-[#003366] border-b border-gray-150 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d60000]" />
              <span>{t("latestUpdates")}</span>
            </h3>

            <div className="space-y-4">
              {list.map((item, idx) => (
                <div key={idx} className="p-4 rounded border border-gray-100 bg-gray-50/30 flex gap-4 items-start hover:border-gray-300 transition-all">
                  <div className="p-2.5 rounded bg-blue-500/10 text-[#003366] shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Notification Bulletin</span>
                    <h4 className="serif-title text-xs sm:text-sm font-black text-gray-900 leading-snug hover:text-[#d60000]">
                      <a href="#">{item}</a>
                    </h4>
                    <div className="flex gap-2.5 text-[9px] font-bold text-gray-400 uppercase pt-1">
                      <span>VERIFIED DESK</span>
                      <span>•</span>
                      <span>JUNE 23, 2026</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Column (4 cols): Quick Links & Scholarships */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Counseling Checklist */}
          <div className="bg-white p-5 border border-gray-200 rounded shadow-sm space-y-4">
            <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] border-b border-gray-150 pb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#d60000]" />
              <span>{language === "ta" ? "கலந்தாய்வு கையேடு" : "Admission Counseling"}</span>
            </h4>
            
            <ul className="space-y-3 font-semibold text-xs text-gray-700">
              <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span>TNEA (Engineering)</span>
                <span className="text-[10px] font-black uppercase text-[#d60000]">Open July 18</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span>NEET (Medical)</span>
                <span className="text-[10px] font-black uppercase text-amber-600">Pending next week</span>
              </li>
              <li className="flex justify-between items-center pb-1">
                <span>TANCET (MCA/MBA)</span>
                <span className="text-[10px] font-black uppercase text-gray-400">Closed</span>
              </li>
            </ul>
          </div>

          {/* Scholarship Alerts */}
          <div className="bg-white p-5 border border-gray-200 rounded shadow-sm space-y-4">
            <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] border-b border-gray-150 pb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d60000]" />
              <span>{language === "ta" ? "உதவித்தொகை செய்திகள்" : "Scholarships & Awards"}</span>
            </h4>

            <div className="space-y-3 text-xs font-semibold leading-relaxed">
              <div className="space-y-1">
                <h5 className="font-extrabold text-gray-800">{language === "ta" ? "மூவலூர் ராமாமிர்தம் அம்மையார் திட்டம்" : "Pudhumai Penn Scheme (Moovalur Ramamirtham)"}</h5>
                <p className="text-[10px] text-gray-500 font-bold">Monthly incentive of ₹1,000 for government school girls entering collegiate courses.</p>
              </div>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-gray-800">{language === "ta" ? "தமிழ்ப் புதல்வன் திட்டம்" : "Tamil Pudhalvan Scheme"}</h5>
                <p className="text-[10px] text-gray-500 font-bold">State scholarship support of ₹1,000 per month for government school boys transitioning to higher education.</p>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
