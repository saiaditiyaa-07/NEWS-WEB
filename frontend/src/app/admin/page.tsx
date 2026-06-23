"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, LayoutDashboard, FileText, Settings, Users, 
  Eye, BookOpen, UserCheck, Inbox, Plus, ArrowUpRight, TrendingUp 
} from "lucide-react";

interface Analytics {
  total_views: number;
  total_articles: number;
  active_users: number;
  newsletter_subscribers: number;
  category_views: Record<string, number>;
  views_over_time: { date: string; views: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          throw new Error();
        }
      } catch (err) {
        setData({
          total_views: 1420530,
          total_articles: 6,
          active_users: 2410,
          newsletter_subscribers: 84230,
          category_views: {
            "Technology": 620400,
            "Science": 310200,
            "Business": 290100,
            "Politics": 110500,
            "Entertainment": 89330
          },
          views_over_time: [
            { date: "Jun 17", views: 185000 },
            { date: "Jun 18", views: 192000 },
            { date: "Jun 19", views: 204000 },
            { date: "Jun 20", views: 215000 },
            { date: "Jun 21", views: 230000 },
            { date: "Jun 22", views: 245000 },
            { date: "Jun 23", views: 260000 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d60000] border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-gray-400">Loading Console Terminal...</p>
        </div>
      </div>
    );
  }

  // Draw chart path
  const chartHeight = 120;
  const chartWidth = 500;
  const viewsArray = data.views_over_time.map(v => v.views);
  const minViews = Math.min(...viewsArray) * 0.95;
  const maxViews = Math.max(...viewsArray) * 1.05;
  const viewsRange = maxViews - minViews;

  const points = data.views_over_time.map((item, idx) => {
    const x = (idx / (data.views_over_time.length - 1)) * chartWidth;
    const y = chartHeight - ((item.views - minViews) / viewsRange) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `${points} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <div className="flex min-h-screen bg-white transition-colors">
      
      {/* Console Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 hidden md:block shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gray-900 font-extrabold text-xs tracking-wider uppercase">
            <LayoutDashboard className="w-4 h-4 text-[#d60000]" />
            <span>Console Panel</span>
          </div>

          <nav className="flex flex-col gap-2 font-bold text-xs tracking-wider uppercase text-gray-600">
            <Link 
              href="/admin" 
              className="px-3.5 py-2.5 rounded bg-red-50 text-[#d60000] flex items-center gap-2 border border-red-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </Link>
            <Link 
              href="/admin/articles" 
              className="px-3.5 py-2.5 rounded hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>CMS Article Manager</span>
            </Link>
            <a 
              href="#" 
              className="px-3.5 py-2.5 rounded hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-gray-400" />
              <span>User Permissions</span>
            </a>
            <a 
              href="#" 
              className="px-3.5 py-2.5 rounded hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Config Defaults</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 bg-white">
        
        {/* Header segment */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-5 gap-4">
          <div>
            <h1 className="serif-title text-2xl font-black text-[#003366] leading-tight tracking-tight uppercase">
              Publisher Analytics Terminal
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Live intelligence reports, metrics, and content management dashboard.
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="px-4 py-2 bg-[#d60000] hover:bg-[#b50000] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Launch CMS Form</span>
          </Link>
        </div>

        {/* Dashboard Widgets Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Views */}
          <div className="p-5 rounded border border-gray-200 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Total Pageviews</span>
              <h3 className="serif-title text-2xl font-black text-gray-900 tracking-tight">
                {data.total_views.toLocaleString()}
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <span>+12.4% vs last week</span>
              </span>
            </div>
            <div className="p-3 rounded bg-blue-500/10 text-[#003366]">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Article Count */}
          <div className="p-5 rounded border border-gray-200 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Catalog Articles</span>
              <h3 className="serif-title text-2xl font-black text-gray-900 tracking-tight">
                {data.total_articles}
              </h3>
              <span className="text-[10px] font-bold text-gray-400">Active index count</span>
            </div>
            <div className="p-3 rounded bg-blue-500/10 text-[#003366]">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Active Readers */}
          <div className="p-5 rounded border border-gray-200 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Active Readers</span>
              <h3 className="serif-title text-2xl font-black text-gray-900 tracking-tight">
                {data.active_users.toLocaleString()}
              </h3>
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                <span>Simulated active terminal</span>
              </span>
            </div>
            <div className="p-3 rounded bg-blue-500/10 text-[#003366]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Subscribers */}
          <div className="p-5 rounded border border-gray-200 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Briefing Subscribers</span>
              <h3 className="serif-title text-2xl font-black text-gray-900 tracking-tight">
                {data.newsletter_subscribers.toLocaleString()}
              </h3>
              <span className="text-[10px] font-bold text-emerald-600">
                <span>+820 today</span>
              </span>
            </div>
            <div className="p-3 rounded bg-blue-500/10 text-[#003366]">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Graphics Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Spline SVG Line Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded border border-gray-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="serif-title text-xs font-extrabold uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#d60000]" />
                <span>Views Progression (Last 7 Days)</span>
              </h4>
              <span className="text-[10px] font-bold text-gray-400">Volume index</span>
            </div>

            {/* Custom Inline SVG chart */}
            <div className="relative pt-4 w-full h-[160px] flex flex-col justify-end">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d60000" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#d60000" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="rgba(156, 163, 175, 0.08)" strokeDasharray="3" />
                <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="rgba(156, 163, 175, 0.08)" strokeDasharray="3" />
                <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="rgba(156, 163, 175, 0.08)" strokeDasharray="3" />

                {/* Gradient fill */}
                <polygon points={fillPoints} fill="url(#chartGlow)" />

                {/* Path line */}
                <polyline 
                  fill="none" 
                  stroke="#d60000" 
                  strokeWidth="2.5" 
                  points={points} 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {data.views_over_time.map((item, idx) => {
                  const x = (idx / (data.views_over_time.length - 1)) * chartWidth;
                  const y = chartHeight - ((item.views - minViews) / viewsRange) * chartHeight;
                  return (
                    <g key={idx} className="cursor-pointer">
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="3.5" 
                        fill="#d60000" 
                        className="stroke-white stroke-2 hover:fill-red-400"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Axis Labels */}
              <div className="flex justify-between pt-2 border-t border-gray-200 text-[10px] font-bold text-gray-400">
                {data.views_over_time.map((item, idx) => (
                  <span key={idx}>{item.date}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Share breakdown (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded border border-gray-200 bg-white space-y-5 shadow-sm">
            <h4 className="serif-title text-xs font-extrabold uppercase tracking-widest text-[#003366]">
              <BarChart3 className="w-4 h-4 text-[#d60000]" />
              <span>Index Traffic Share</span>
            </h4>

            <div className="space-y-4">
              {Object.entries(data.category_views).map(([cat, val]) => {
                const total = Object.values(data.category_views).reduce((a, b) => a + b, 0);
                const percent = total > 0 ? (val / total) * 100 : 0;
                
                // Get bar color
                let barColor = "bg-[#d60000]";
                if (cat.toLowerCase() === "business") barColor = "bg-[#003366]";
                if (cat.toLowerCase() === "science") barColor = "bg-emerald-600";
                if (cat.toLowerCase() === "entertainment") barColor = "bg-purple-600";

                return (
                  <div key={cat} className="space-y-1.5 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{cat}</span>
                      <span className="text-gray-400">{percent.toFixed(0)}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${percent}%` }} 
                        className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                        title={`${cat}: ${percent.toFixed(0)}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
