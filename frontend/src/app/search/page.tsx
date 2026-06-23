"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Bookmark, Flame, Sparkles, Filter, Loader2 } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";

interface Article {
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialTag = searchParams.get("tag") || "";
  const isBookmarksOnly = searchParams.get("bookmarks") === "true";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Suggested / Trending Searches
  const trendingSearches = ["Silicon Photonics", "Longevity", "Green Hydrogen", "Sovereignty Act", "Tokamak Fusion"];
  const categoriesList = ["All", "Technology", "Science", "Business", "Politics", "Entertainment"];

  useEffect(() => {
    setSearchQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  useEffect(() => {
    const executeSearch = async () => {
      setLoading(true);
      try {
        if (isBookmarksOnly) {
          // Read local storage bookmarks
          const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
          
          // Apply query/category filters client-side on bookmarks if needed
          let filtered = bookmarks;
          if (initialQuery) {
            const q = initialQuery.toLowerCase();
            filtered = filtered.filter((b: any) => 
              b.title.toLowerCase().includes(q) || 
              b.summary.toLowerCase().includes(q) ||
              b.author.toLowerCase().includes(q)
            );
          }
          if (initialCategory !== "All") {
            filtered = filtered.filter((b: any) => b.category.toLowerCase() === initialCategory.toLowerCase());
          }
          setResults(filtered);
        } else {
          // Fetch from FastAPI server
          let url = "http://127.0.0.1:8000/api/articles?";
          const params: string[] = [];
          
          if (initialQuery) params.push(`search=${encodeURIComponent(initialQuery)}`);
          if (initialCategory && initialCategory !== "All") params.push(`category=${encodeURIComponent(initialCategory)}`);
          if (initialTag) params.push(`tag=${encodeURIComponent(initialTag)}`);
          
          const res = await fetch(url + params.join("&"));
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          } else {
            throw new Error();
          }
        }
      } catch (err) {
        // Fallback static matches
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [initialQuery, initialCategory, initialTag, isBookmarksOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(searchQuery, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateURL(searchQuery, category);
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    updateURL(term, selectedCategory);
  };

  const updateURL = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "All") params.set("category", category);
    if (isBookmarksOnly) params.set("bookmarks", "true");
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    router.push(isBookmarksOnly ? "/search?bookmarks=true" : "/search");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            {isBookmarksOnly ? (
              <>
                <Bookmark className="w-6 h-6 text-blue-550 fill-blue-550/10" />
                <span>Saved Briefing Portfolio</span>
              </>
            ) : (
              <>
                <SearchIcon className="w-6 h-6 text-blue-500" />
                <span>Search News Indices</span>
              </>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            {isBookmarksOnly 
              ? "Your offline saved reading compilation." 
              : "Search all intelligence reports, research, and analysis."
            }
          </p>
        </div>
        
        {isBookmarksOnly && (
          <button
            onClick={() => router.push("/search")}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Switch to Global Search
          </button>
        )}
      </div>

      {/* Main search layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* Left Filter & Search settings column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main search input box */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Topic, author, tag..."
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
              />
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </form>

          {/* Category Filter selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-450 flex items-center gap-1">
              <Filter className="w-3 h-3 text-gray-500" />
              <span>Category Filters</span>
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {categoriesList.map((cat) => {
                const isSel = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 text-left text-xs font-bold rounded transition-all ${
                      isSel
                        ? "bg-[#003366] text-white shadow-sm"
                        : "bg-gray-100 hover:bg-gray-250 text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Actions */}
          <button
            onClick={clearFilters}
            className="w-full py-2 text-xs font-bold text-center border border-gray-200 rounded hover:border-[#d60000] hover:text-[#d60000] transition-colors bg-white text-gray-600"
          >
            Clear Filters
          </button>

          {/* Trending term suggestion block (Only visible on global search) */}
          {!isBookmarksOnly && (
            <div className="p-4 rounded border border-gray-200 bg-gray-50 space-y-3 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                <span>Trending Queries</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-2.5 py-1 text-[10px] font-bold rounded bg-white border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Search Results Column (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Results Metadata Summary */}
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>
              {loading 
                ? "Indexing database..." 
                : `${results.length} briefings match current query`
              }
            </span>
            {initialQuery && (
              <span>
                Search term: <span className="text-gray-700 font-bold">"{initialQuery}"</span>
              </span>
            )}
          </div>

          {/* Skeletons/Grid Loader */}
          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-xs font-bold text-gray-450">Indexing news entries...</p>
            </div>
          ) : results.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded border border-dashed border-gray-300 text-center space-y-3 shadow-sm">
              <Sparkles className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-extrabold text-sm text-gray-900">No Briefings Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                We couldn't locate reports matching those filters. Try adjusting keywords, removing tags, or resetting categories.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-md transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            /* Results Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((art) => (
                <ArticleCard key={art.id} article={art as any} />
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="h- screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
