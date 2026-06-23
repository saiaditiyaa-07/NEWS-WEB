"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Eye, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    title_ta?: string;
    summary: string;
    summary_ta?: string;
    image: string;
    category: string;
    category_ta?: string;
    author: string;
    published_at: string;
    views: number;
    reading_time: number;
    trending?: boolean;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { language, t } = useLanguage();
  const [imgSrc, setImgSrc] = useState(article.image || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(article.image || FALLBACK_IMAGE);
  }, [article.image]);

  const getBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "politics":
      case "tamil nadu":
        return "badge-politics";
      case "business": return "badge-business";
      case "science": return "badge-science";
      case "technology": return "badge-technology";
      case "entertainment": return "badge-entertainment";
      default: return "badge-politics";
    }
  };

  const title = language === "ta" ? article.title_ta || article.title : article.title;
  const summary = language === "ta" ? article.summary_ta || article.summary : article.summary;
  const category = language === "ta" ? article.category_ta || article.category : article.category;

  return (
    <article className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-all duration-200 min-h-[380px]">
      
      {/* Article Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 border-b border-gray-200">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover w-full h-full transform group-hover:scale-[1.02] transition-transform duration-350"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getBadgeClass(article.category)}`}>
          {category}
        </span>

        {/* Trending Alert */}
        {article.trending && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-black bg-[#d60000] text-white flex items-center gap-0.5 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 fill-white" />
            <span>TRENDING</span>
          </span>
        )}
      </div>

      {/* Typography */}
      <div className="flex flex-1 flex-col p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
          <span>{article.author}</span>
          <span>•</span>
          <span>{new Date(article.published_at).toLocaleDateString(language === "ta" ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        <h3 className="serif-title text-base sm:text-lg font-extrabold tracking-tight text-gray-900 leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
          <Link href={`/article/${article.id}`}>
            <span className="absolute inset-0" />
            {title}
          </Link>
        </h3>

        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 font-semibold">
          {summary}
        </p>

        {/* Read metrics panel */}
        <div className="flex items-center justify-between pt-3.5 mt-auto border-t border-gray-200 text-[10px] font-bold text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#003366]" />
            <span>{article.reading_time} {language === "ta" ? "நிமிட வாசிப்பு" : "min read"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{(article.views || 0).toLocaleString()} {language === "ta" ? "பார்வைகள்" : "views"}</span>
          </div>
        </div>

      </div>

    </article>
  );
}
