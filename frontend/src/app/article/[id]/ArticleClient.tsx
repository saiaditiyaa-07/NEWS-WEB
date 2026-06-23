"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Play, Pause, RotateCcw, Bookmark, Check, 
  ChevronRight, Calendar, Eye, Clock, MessageSquare, 
  Send, Copy 
} from "lucide-react";
import AiSidebar from "@/components/AiSidebar";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  created_at: string;
  likes: number;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  author_role: string;
  author_avatar: string;
  published_at: string;
  views: number;
  likes: number;
  reading_time: number;
  tags: string[];
  ai_summary: string;
  key_takeaways: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    label: string;
  };
  comments: Comment[];
}

interface ArticleClientProps {
  article: Article;
  relatedArticles: any[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  
  // TTS State
  const [ttsState, setTtsState] = useState<"stopped" | "playing" | "paused">("stopped");
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(article.comments || []);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Suggest Next Drawer State
  const [showNextDrawer, setShowNextDrawer] = useState(false);

  useEffect(() => {
    // 1. Scroll progress listener
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
        
        // Show next article suggestion drawer at 80% scroll
        setShowNextDrawer(progress > 80);
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    // 2. Load bookmark state
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.some((b: any) => b.id === article.id));

    // 3. Initialize Speech Synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [article.id]);

  // Bookmarking handler
  const toggleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== article.id);
      setIsBookmarked(false);
    } else {
      bookmarks.push({
        id: article.id,
        title: article.title,
        summary: article.summary,
        image: article.image,
        category: article.category,
        author: article.author,
        published_at: article.published_at,
        views: article.views,
        reading_time: article.reading_time
      });
      setIsBookmarked(true);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  // TTS Controls
  const handleTtsPlay = () => {
    if (!synthRef.current) return;

    if (ttsState === "paused") {
      synthRef.current.resume();
      setTtsState("playing");
      return;
    }

    synthRef.current.cancel();
    const textToSpeak = `${article.title}. By ${article.author}. ${article.content}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => {
      setTtsState("stopped");
    };
    utterance.onerror = () => {
      setTtsState("stopped");
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setTtsState("playing");
  };

  const handleTtsPause = () => {
    if (synthRef.current && ttsState === "playing") {
      synthRef.current.pause();
      setTtsState("paused");
    }
  };

  const handleTtsStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setTtsState("stopped");
    }
  };

  // Clipboard copy
  const copyToClipboard = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Share triggers
  const getShareLink = (platform: "twitter" | "facebook" | "linkedin") => {
    if (typeof window === "undefined") return "#";
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    
    switch (platform) {
      case "twitter": return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
  };

  // Add Comment Form submit
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/articles/${article.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: commentAuthor.trim() || "Anonymous Reader",
          content: commentText.trim()
        })
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        setCommentAuthor("");
      }
    } catch (err) {
      const offlineComment: Comment = {
        id: `offline-${Date.now()}`,
        author: commentAuthor.trim() || "Reader Comment",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        content: commentText.trim(),
        created_at: new Date().toISOString(),
        likes: 0
      };
      setComments((prev) => [offlineComment, ...prev]);
      setCommentText("");
      setCommentAuthor("");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Get category badge color class
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

  const nextArticle = relatedArticles[0] || null;

  return (
    <div className="min-h-screen bg-white relative pb-16 transition-colors">
      {/* 1. Scroll Progress Bar (News Red) */}
      <div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#d60000] z-[60] transition-all duration-75 origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#d60000]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <Link href={`/search?category=${article.category}`} className="hover:text-[#d60000]">{article.category}</Link>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="text-gray-500 truncate max-w-[200px]">Report #{article.id}</span>
        </div>

        {/* Layout Grid: Content + AI Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article read area */}
          <article className="lg:col-span-8 space-y-6">
            
            {/* Header section */}
            <div className="space-y-4">
              <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getBadgeClass(article.category)}`}>
                {article.category}
              </span>
              
              <h1 className="serif-title text-2xl sm:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Author & Stats */}
              <div className="flex flex-wrap items-center justify-between border-y border-gray-200 py-3 gap-4">
                
                <div className="flex items-center gap-3">
                  <img 
                    src={article.author_avatar} 
                    alt={article.author}
                    className="w-10 h-10 rounded object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900">{article.author}</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider">{article.author_role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#003366]" />
                    <span>{article.reading_time} min read</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{(article.views || 0).toLocaleString()} views</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded overflow-hidden border border-gray-200 bg-gray-50">
              <img 
                src={article.image} 
                alt={article.title} 
                className="object-cover w-full h-full"
              />
            </div>

            {/* Utility Control Panel: Audio, Bookmark, share */}
            <div className="p-4 rounded border border-gray-200 bg-[#f8f9fa] flex flex-wrap items-center justify-between gap-4 shadow-sm">
              
              {/* Audio controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mr-2">Audio Assist</span>
                {ttsState !== "playing" ? (
                  <button
                    onClick={handleTtsPlay}
                    className="px-3.5 py-1.5 rounded bg-[#d60000] hover:bg-[#b50000] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Listen</span>
                  </button>
                ) : (
                  <button
                    onClick={handleTtsPause}
                    className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-955 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <Pause className="w-3 h-3 fill-slate-950" />
                    <span>Pause</span>
                  </button>
                )}
                {ttsState !== "stopped" && (
                  <button
                    onClick={handleTtsStop}
                    className="px-3.5 py-1.5 rounded bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Bookmark & shares */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`px-3.5 py-1.5 rounded border flex items-center gap-1 text-xs font-bold transition-all ${
                    isBookmarked
                      ? "bg-red-50 border-red-205 text-[#d60000]"
                      : "bg-white border-gray-200 hover:border-[#d60000] hover:text-[#d60000] text-gray-700"
                  }`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark this report"}
                >
                  <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>

                <span className="h-6 w-px bg-gray-200 mx-1" />

                {/* Social Share Buttons */}
                <div className="flex gap-1">
                  <a
                    href={getShareLink("twitter")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#d60000] transition-all flex items-center justify-center"
                    title="Share on X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={getShareLink("facebook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#d60000] transition-all flex items-center justify-center"
                    title="Share on Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                  <a
                    href={getShareLink("linkedin")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#d60000] transition-all flex items-center justify-center"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-500 hover:text-gray-900 transition-all relative flex items-center justify-center"
                    title="Copy report URL"
                  >
                    {showCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {showCopied && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded bg-gray-900 text-[9px] text-white font-bold tracking-wide whitespace-nowrap shadow-md">
                        Copied Link
                      </span>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Content paragraph body */}
            <div className="prose prose-slate max-w-none text-gray-800 text-sm sm:text-base font-medium leading-relaxed space-y-6">
              {article.content.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Tags section */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mr-2">Indexing Tags</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded bg-gray-50 text-xs font-bold text-gray-600 border border-gray-200 hover:border-[#d60000] hover:text-[#d60000] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Related Articles panel */}
            {relatedArticles && relatedArticles.length > 0 && (
              <section className="space-y-4 pt-10 border-t border-gray-200">
                <h3 className="serif-title text-sm font-extrabold uppercase tracking-widest text-gray-900 border-b border-[#d60000] pb-1">
                  Related Intelligence Reports
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedArticles.map((art) => (
                    <div 
                      key={art.id} 
                      className="p-4 rounded border border-gray-200 flex flex-col justify-between hover:border-gray-400 transition-all bg-white shadow-sm group relative"
                    >
                      <div className="space-y-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${getBadgeClass(art.category)}`}>
                          {art.category}
                        </span>
                        <h4 className="serif-title text-xs font-extrabold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#d60000] transition-colors">
                          <Link href={`/article/${art.id}`}>
                            <span className="absolute inset-0" />
                            {art.title}
                          </Link>
                        </h4>
                      </div>
                      <span className="text-[9px] font-semibold text-gray-400 mt-4">
                        By {art.author}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Comments Terminal */}
            <section id="comments" className="space-y-6 pt-10 border-t border-gray-200">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <MessageSquare className="w-5 h-5 text-[#d60000]" />
                <h3 className="serif-title text-sm font-extrabold uppercase tracking-widest text-gray-900">
                  Reader Comments ({comments.length})
                </h3>
              </div>

              {/* Add Comment form */}
              <form onSubmit={handleAddComment} className="p-4 rounded border border-gray-200 bg-gray-50 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Commenter Name..."
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 font-semibold text-gray-900"
                  />
                </div>
                <textarea
                  placeholder="Enter commentary content..."
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 font-semibold text-gray-900"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded flex items-center gap-1.5 transition-colors disabled:opacity-50 uppercase tracking-wider"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingComment ? "Publishing..." : "Submit Comment"}</span>
                </button>
              </form>

              {/* Comments Feed list */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-xs font-bold text-center text-gray-400 py-6">
                    No reader commentary has been logged for this report yet.
                  </p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="flex gap-3 items-start p-4 rounded border border-gray-200 bg-white shadow-sm">
                      <img 
                        src={comm.avatar} 
                        alt={comm.author} 
                        className="w-7 h-7 rounded object-cover shrink-0 border border-gray-200"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-gray-900">{comm.author}</span>
                          <span className="text-gray-400">{new Date(comm.created_at).toLocaleDateString('en-US')}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                          {comm.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </section>

          </article>

          {/* AI Sidebar Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[88px] space-y-6">
              <AiSidebar 
                articleId={article.id} 
                aiSummary={article.ai_summary} 
                keyTakeaways={article.key_takeaways} 
                sentiment={article.sentiment} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Floating Next Article Drawer */}
      {showNextDrawer && nextArticle && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-white border-2 border-[#d60000] p-4 rounded shadow-md animate-slide-in hidden md:block">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#d60000]">
                Continue Reading
              </span>
              <button 
                onClick={() => setShowNextDrawer(false)}
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
              >
                Dismiss
              </button>
            </div>
            
            <h4 className="serif-title text-xs font-black leading-snug text-gray-900 line-clamp-2">
              {nextArticle.title}
            </h4>
            
            <Link
              href={`/article/${nextArticle.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:underline uppercase tracking-wide"
            >
              <span>Next Report</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#d60000]" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
