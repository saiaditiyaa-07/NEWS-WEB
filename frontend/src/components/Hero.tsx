"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Eye, Calendar, Sparkles, ChevronRight } from "lucide-react";

interface HeroArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
}

export default function Hero() {
  const [articles, setArticles] = useState<HeroArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditorsPicks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/articles?editors_pick=true");
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        } else {
          throw new Error();
        }
      } catch (err) {
        setArticles([
          {
            id: "1",
            title: "The Silicon Horizon: Quantum Photonic Accelerators Enter Commercial Fab Production",
            summary: "Electronic computing is approaching physical silicon limits. A quiet revolution in optoelectronics is launching light-based quantum accelerators into industrial scale.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
            category: "Technology",
            author: "Dr. Aris Thorne",
            published_at: "2026-06-23T10:30:00Z",
            views: 41250,
            reading_time: 4
          },
          {
            id: "3",
            title: "The Decarbonization Boom: Green Hydrogen Attracts $120B in Venture Capital",
            summary: "Large investment combines with massive electrolyzer projects as policy mandates spark a run on zero-emission fuel production.",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
            category: "Business",
            author: "Julian Sterling",
            published_at: "2026-06-21T14:20:00Z",
            views: 35100,
            reading_time: 4
          },
          {
            id: "6",
            title: "Next-Gen Fusion: High-Temperature Superconducting Magnets Clear Final Stability Review",
            summary: "A breakthrough magnetic assembly has maintained a plasma core at 150 million degrees for over 10 hours, bringing commercial fusion closer.",
            image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
            category: "Technology",
            author: "Dr. Clara Wu",
            published_at: "2026-06-18T09:00:00Z",
            views: 52100,
            reading_time: 4
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEditorsPicks();
  }, []);

  if (loading) return <div className="h-[380px] bg-gray-50 rounded-lg border border-gray-200" />;
  if (articles.length === 0) return null;

  const mainStory = articles[0];
  const sideStories = articles.slice(1, 3);

  const getBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "politics": return "badge-politics";
      case "business": return "badge-business";
      case "science": return "badge-science";
      case "technology": return "badge-technology";
      case "entertainment": return "badge-entertainment";
      default: return "badge-politics";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
      
      {/* Left Columns (8/12 wide) - Primary Spotlight Headline */}
      <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 group relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getBadgeClass(mainStory.category)}`}>
              {mainStory.category}
            </span>
            <span className="text-[10px] font-black tracking-widest text-[#d60000] uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Editorial Highlight</span>
            </span>
          </div>

          <h1 className="serif-title text-2xl sm:text-3xl font-black tracking-tight leading-tight text-gray-900 group-hover:text-[#d60000] transition-colors duration-200">
            <Link href={`/article/${mainStory.id}`}>
              <span className="absolute inset-0" />
              {mainStory.title}
            </Link>
          </h1>

          <p className="text-gray-605 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
            {mainStory.summary}
          </p>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-200 my-4 bg-gray-50">
          <img 
            src={mainStory.image} 
            alt={mainStory.title} 
            className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-gray-400 pt-2 border-t border-gray-200">
          <span>By {mainStory.author}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(mainStory.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{mainStory.reading_time} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{(mainStory.views || 0).toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Columns (4/12 wide) - Secondary Spotlight List */}
      <div className="lg:col-span-4 bg-gray-50 p-6 flex flex-col divide-y divide-gray-200">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#003366] pb-3 mb-3 border-b border-gray-200">
          Executive Pickings
        </h4>

        {sideStories.map((story, idx) => (
          <div 
            key={story.id} 
            className={`flex flex-col justify-between py-4 group/side relative ${idx === 0 ? "pt-0" : ""} ${idx === sideStories.length - 1 ? "pb-0" : ""}`}
          >
            <div className="space-y-2">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${getBadgeClass(story.category)}`}>
                {story.category}
              </span>
              <h3 className="serif-title text-sm font-extrabold leading-snug text-gray-900 group-hover/side:text-[#d60000] transition-colors duration-200 line-clamp-3">
                <Link href={`/article/${story.id}`}>
                  <span className="absolute inset-0" />
                  {story.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-2 font-semibold">
                {story.summary}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mt-4 pt-2 border-t border-gray-200">
              <span>{story.author}</span>
              <span className="text-[#003366] flex items-center gap-0.5 hover:underline font-extrabold">
                <span>View</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
