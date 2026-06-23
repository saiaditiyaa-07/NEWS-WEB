import React from "react";
import Link from "next/link";
import { Clock, Eye, Sparkles } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    image: string;
    category: string;
    author: string;
    published_at: string;
    views: number;
    reading_time: number;
    trending?: boolean;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
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
    <article className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Article Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-50 border-b border-gray-250">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350"
        />
        
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getBadgeClass(article.category)}`}>
          {article.category}
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
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
          <span>{article.author}</span>
          <span>•</span>
          <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        <h3 className="serif-title text-sm sm:text-base font-extrabold tracking-tight text-gray-900 leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
          <Link href={`/article/${article.id}`}>
            <span className="absolute inset-0" />
            {article.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-2 font-semibold">
          {article.summary}
        </p>

        {/* Read metrics panel */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200 text-[10px] font-bold text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#003366]" />
            <span>{article.reading_time} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{(article.views || 0).toLocaleString()} views</span>
          </div>
        </div>

      </div>

    </article>
  );
}
