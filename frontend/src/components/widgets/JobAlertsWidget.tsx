"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface JobAlert {
  id: string;
  title: string;
  title_ta: string;
  organization: string;
  organization_ta: string;
  category: string;
  category_ta: string;
  deadline: string;
  deadline_ta: string;
  link: string;
}

export default function JobAlertsWidget() {
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        setJobs([
          {
            id: "j1",
            title: "Junior Assistant, VAO Recruitment (Group 4)",
            title_ta: "இளநிலை உதவியாளர், கிராம நிர்வாக அலுவலர் (VAO)",
            organization: "Tamil Nadu Public Service Commission (TNPSC)",
            organization_ta: "தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்",
            category: "Government",
            category_ta: "அரசுப் பணி",
            deadline: "July 20, 2026",
            deadline_ta: "ஜூலை 20, 2026",
            link: "/jobs"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-[#d60000]" />
          <span>{t("jobsAlert")}</span>
        </h4>
        <Link href="/jobs" className="text-[9px] font-black text-[#d60000] hover:underline uppercase tracking-wide">
          {language === "ta" ? "அனைத்தும்" : "All"}
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.slice(0, 2).map((job) => {
          const title = language === "ta" ? job.title_ta : job.title;
          const org = language === "ta" ? job.organization_ta : job.organization;
          const deadline = language === "ta" ? job.deadline_ta : job.deadline;
          const cat = language === "ta" ? job.category_ta : job.category;

          return (
            <div key={job.id} className="p-3 border border-gray-100 rounded hover:border-gray-300 transition-all bg-gray-50/50 space-y-1.5 relative">
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${
                job.category.toLowerCase() === "government" ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}>
                {cat}
              </span>
              
              <h5 className="serif-title text-[11px] font-extrabold leading-snug text-gray-900 hover:text-[#d60000]">
                <Link href="/jobs">
                  {title}
                </Link>
              </h5>

              <p className="text-[10px] text-gray-500 font-bold leading-normal">{org}</p>

              <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 border-t border-gray-100 pt-1.5 mt-1.5 justify-between">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                  <span>{deadline}</span>
                </div>
                <span className="text-[#003366] font-black text-[9px] uppercase tracking-wider">{language === "ta" ? "விண்ணப்பி" : "Apply"} &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
