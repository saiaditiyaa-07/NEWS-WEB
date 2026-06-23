"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Briefcase, Calendar, Search, Filter, Loader2, MapPin } from "lucide-react";
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

export default function JobsPage() {
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<JobAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
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
          },
          {
            id: "j2",
            title: "Software Engineer, Cloud Infrastructure Desk",
            title_ta: "மென்பொருள் பொறியாளர் (கிளவுட் உள்கட்டமைப்பு)",
            organization: "Kumari Tech Solutions Pvt Ltd",
            organization_ta: "குமரி டெக் சொல்யூஷன்ஸ்",
            category: "Private",
            category_ta: "தனியார் துறை",
            deadline: "July 15, 2026",
            deadline_ta: "ஜூலை 15, 2026",
            link: "/jobs"
          },
          {
            id: "j3",
            title: "Probationary Officers recruitment exam notices",
            title_ta: "வங்கி அதிகாரி (PO) தேர்வுகள் அறிவிப்பு",
            organization: "State Bank of India (SBI)",
            organization_ta: "பாரத ஸ்டேட் வங்கி",
            category: "Government",
            category_ta: "அரசுப் பணி",
            deadline: "August 02, 2026",
            deadline_ta: "ஆகஸ்ட் 02, 2026",
            link: "/jobs"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = language === "ta" ? job.title_ta : job.title;
    const org = language === "ta" ? job.organization_ta : job.organization;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || job.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

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
        <span className="text-[10px] font-black uppercase tracking-widest text-[#d60000] block">TN Recruitment Bulletins</span>
        <h1 className="serif-title text-2xl font-black text-[#003366] flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-[#d60000]" />
          <span>{language === "ta" ? "வேலைவாய்ப்பு செய்திகள்" : "Employment Opportunity Board"}</span>
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Monitor public service notifications, bank entrance test deadlines, railway jobs, and regional corporate placement notices.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Filters Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 border border-gray-200 rounded shadow-sm space-y-4">
            
            {/* Search query box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Search Listings</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hiring org or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category selectors */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-450 flex items-center gap-1">
                <Filter className="w-3 h-3 text-gray-500" />
                <span>Sector Filters</span>
              </span>
              
              <div className="flex flex-col gap-1.5 font-bold text-xs">
                {["All", "Government", "Private"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-2 text-left rounded transition-all cursor-pointer ${
                      filterCategory === cat
                        ? "bg-[#003366] text-white shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-650"
                    }`}
                  >
                    {cat === "All" ? (language === "ta" ? "அனைத்தும்" : "All Sectors") : ""}
                    {cat === "Government" ? (language === "ta" ? "அரசு வேலைவாய்ப்புகள்" : "Govt Alerts") : ""}
                    {cat === "Private" ? (language === "ta" ? "தனியார் வேலைவாய்ப்புகள்" : "Private Desk") : ""}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Listings Column (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded shadow-sm space-y-4">
            
            <div className="flex justify-between items-center text-xs font-bold text-gray-450 border-b border-gray-150 pb-2">
              <span>{filteredJobs.length} active announcements found</span>
              <span className="text-[8px] font-black text-gray-400 tracking-wider uppercase">TNPSC & CORPORATE SYNC: ACTIVE</span>
            </div>

            {loading ? (
              <div className="h-40 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#d60000]" />
                <p className="text-xs font-bold text-gray-405">Syncing placements indices...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 border border-dashed border-gray-200 rounded text-center text-gray-400 text-xs font-bold">
                No matching opportunities found. Try adjusting filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => {
                  const title = language === "ta" ? job.title_ta : job.title;
                  const org = language === "ta" ? job.organization_ta : job.organization;
                  const deadline = language === "ta" ? job.deadline_ta : job.deadline;
                  const cat = language === "ta" ? job.category_ta : job.category;

                  return (
                    <div key={job.id} className="p-5 border border-gray-200 hover:border-gray-400 transition-all rounded bg-white shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${
                          job.category.toLowerCase() === "government" ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}>
                          {cat}
                        </span>
                        
                        <h4 className="serif-title text-sm font-black text-gray-900 leading-snug hover:text-[#d60000]">
                          <a href={job.link}>{title}</a>
                        </h4>
                        
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#003366] shrink-0" />
                          <span>{org}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-400 mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                          <span>{deadline}</span>
                        </div>
                        <a 
                          href={job.link}
                          className="px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white text-[9px] font-black uppercase tracking-wider rounded"
                        >
                          {language === "ta" ? "விவரங்கள்" : "Apply Details"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>

      </div>

    </div>
  );
}
