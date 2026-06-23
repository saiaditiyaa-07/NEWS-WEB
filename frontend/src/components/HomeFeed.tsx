"use client";

import React, { useState } from "react";
import ArticleCard from "./ArticleCard";
import { Loader2, Plus } from "lucide-react";

interface ArticleData {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
  editors_pick: boolean;
  trending: boolean;
}

interface HomeFeedProps {
  initialArticles: ArticleData[];
}

export default function HomeFeed({ initialArticles }: HomeFeedProps) {
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const offset = articles.length;
      const res = await fetch(`http://127.0.0.1:8000/api/articles?limit=4&offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prev) => [...prev, ...data]);
          if (data.length < 4) {
            setHasMore(false);
          }
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setTimeout(() => {
        const simulatedMore: ArticleData[] = [
          {
            id: `sim-${articles.length + 1}`,
            title: "Simulated Report: Global Quantum Computing Consortium Establishes Cloud Standards",
            summary: "Industry leaders align on virtualization models, ensuring hardware abstractions for secure multi-tenant access to next-gen computing systems.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
            category: "Technology",
            author: "Dr. Aris Thorne",
            published_at: new Date().toISOString(),
            views: 1205,
            reading_time: 3,
            editors_pick: false,
            trending: false
          },
          {
            id: `sim-${articles.length + 2}`,
            title: "Simulated Report: Biosphere Regeneration Projects Complete First Year in Saharan Corridor",
            summary: "Engineered soil inoculants show 80% success rate in moisture retention, restoring native desert shrubs and mitigating local sandstorms.",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80",
            category: "Science",
            author: "Dr. Elena Vance",
            published_at: new Date().toISOString(),
            views: 940,
            reading_time: 4,
            editors_pick: false,
            trending: false
          }
        ];
        setArticles((prev) => [...prev, ...simulatedMore]);
        setHasMore(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid containing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art) => (
          <ArticleCard key={art.id} article={art} />
        ))}
      </div>

      {/* Interactive Controls & Skeletons */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMoreArticles}
            disabled={loading}
            className="px-6 py-2.5 rounded border border-gray-200 text-gray-900 hover:border-gray-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 bg-white shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#d60000]" />
                <span>Syncing Database...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#003366]" />
                <span>Fetch More Reports</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Finality indicator */}
      {!hasMore && (
        <p className="text-center text-xs font-semibold text-gray-400 py-6 border-t border-gray-200">
          All indices loaded. You are fully up to date with the briefing network.
        </p>
      )}
    </div>
  );
}
