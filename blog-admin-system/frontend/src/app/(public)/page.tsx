"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { BlogCardSkeleton } from "@/components/Skeletons";
import {
  Search,
  ArrowRight,
  Clock,
  User,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Lifestyle",
  "Education",
  "Travel",
  "Health",
  "Finance",
];

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  featuredImage: string;
  createdAt: string;
  readingTime?: number;
  tags?: string[];
  views?: number;
}

/* ── Featured Blog Card ── */
const FeaturedCard = ({ blog }: { blog: Blog }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="homepage-featured-card"
      style={{
        position: "relative",
        borderRadius: "1.5rem",
        overflow: "hidden",
        minHeight: "420px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        cursor: "pointer",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, background: "#1e293b" }}>
        {blog.featuredImage && !imgError ? (
          <Image
            src={`${BACKEND_URL}${blog.featuredImage}`}
            alt={blog.title}
            fill
            className="homepage-img-zoom"
            style={{ objectFit: "cover", opacity: 0.7 }}
            sizes="(max-width: 768px) 100vw, 100vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              opacity: 0.8,
            }}
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", padding: "2rem", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.25rem 0.75rem",
              background: "#6366f1",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 700,
              borderRadius: "9999px",
            }}
          >
            <Flame size={11} /> Featured
          </span>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 500,
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {blog.category}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
          }}
        >
          <Link href={`/blogs/${blog.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
            {blog.title}
          </Link>
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            maxWidth: "600px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {blog.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8125rem", color: "#94a3b8" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "50%",
                  background: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: "0.625rem", fontWeight: 700 }}>
                  {blog.author?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              {blog.author}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={12} /> {blog.readingTime || 1} min read
            </span>
          </div>
          <Link
            href={`/blogs/${blog.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#a5b4fc",
              textDecoration: "none",
            }}
          >
            Read More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ── Regular Blog Card ── */
const BlogCard = ({ blog }: { blog: Blog }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="homepage-blog-card"
      style={{
        background: "white",
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "12rem", overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
        {blog.featuredImage && !imgError ? (
          <Image
            src={`${BACKEND_URL}${blog.featuredImage}`}
            alt={blog.title}
            fill
            className="homepage-img-zoom"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={32} style={{ color: "rgba(255,255,255,0.5)" }} />
          </div>
        )}
        {/* Category badge */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(4px)",
              color: "#4338ca",
              fontSize: "0.75rem",
              fontWeight: 700,
              borderRadius: "9999px",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.4,
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <Link
            href={`/blogs/${blog.slug}`}
            className="homepage-card-title"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {blog.title}
          </Link>
        </h2>

        <p
          style={{
            fontSize: "0.875rem",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {blog.description}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid #f1f5f9",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#94a3b8" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <User size={12} /> {blog.author}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={12} /> {blog.readingTime || 1} min
            </span>
          </div>
          <Link
            href={`/blogs/${blog.slug}`}
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#6366f1",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Read <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ── Homepage ── */
export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 9 };
      if (search) params.search = search;
      if (activeCategory !== "All") params.category = activeCategory;
      const { data } = await api.get("/blogs", { params });
      setBlogs(data.blogs || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeCategory]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
  };

  const featuredBlog = !loading && blogs.length > 0 ? blogs[0] : null;
  const gridBlogs = !loading && blogs.length > 1 ? blogs.slice(1) : blogs;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #3b0764 100%)",
          paddingTop: "5rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-10rem",
              left: "-10rem",
              width: "24rem",
              height: "24rem",
              background: "rgba(99,102,241,0.2)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-5rem",
              right: "-5rem",
              width: "24rem",
              height: "24rem",
              background: "rgba(168,85,247,0.15)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40rem",
              height: "40rem",
              background: "rgba(99,102,241,0.05)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Hero Content — all centered */}
        <div
          style={{
            position: "relative",
            maxWidth: "48rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "2rem",
            }}
          >
            <TrendingUp size={14} />
            <span>{total} Articles &amp; Growing</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Discover Ideas
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8, #a78bfa, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              That Inspire
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              lineHeight: 1.6,
              maxWidth: "36rem",
              margin: "0 auto 2.5rem auto",
            }}
          >
            Thoughtfully written articles on technology, design, business and beyond.
            Your next great idea starts here.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            style={{
              position: "relative",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1.25rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search articles, topics, or tags..."
              style={{
                width: "100%",
                padding: "1rem 6rem 1rem 3.25rem",
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "0.875rem",
                outline: "none",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.2s, box-shadow 0.2s",
                fontFamily: "Inter, sans-serif",
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
              aria-label="Search articles"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "0.5rem 1rem",
                background: "#6366f1",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════ CATEGORY PILLS ═══════════════════════ */}
      <div
        style={{
          position: "sticky",
          top: "64px",
          zIndex: 20,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f1f5f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              overflowX: "auto",
              padding: "0.75rem 0",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: activeCategory === cat ? "#6366f1" : "#f1f5f9",
                  color: activeCategory === cat ? "white" : "#64748b",
                  boxShadow: activeCategory === cat ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                }}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ MAIN CONTENT ═══════════════════════ */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Active filter indicator */}
        {(search || activeCategory !== "All") && !loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Showing <span style={{ fontWeight: 600, color: "#1e293b" }}>{total}</span> result
              {total !== 1 ? "s" : ""}
              {search ? ` for "${search}"` : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </p>
            <button
              onClick={() => {
                clearSearch();
                setActiveCategory("All");
              }}
              style={{
                fontSize: "0.75rem",
                color: "#6366f1",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={12} /> Clear all
            </button>
          </div>
        )}

        {loading ? (
          /* Skeleton loading */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
          </div>
        ) : blogs.length === 0 ? (
          /* Empty state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "7rem 1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              <Sparkles size={28} style={{ color: "#cbd5e1" }} />
            </div>
            <h3
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#334155",
                marginBottom: "0.5rem",
              }}
            >
              No articles found
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
                maxWidth: "20rem",
              }}
            >
              {search
                ? `No results for "${search}". Try a different keyword.`
                : `No articles in the ${activeCategory} category yet.`}
            </p>
            <button
              onClick={() => {
                clearSearch();
                setActiveCategory("All");
              }}
              className="btn btn-primary"
              style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
            >
              View all articles
            </button>
          </div>
        ) : (
          <>
            {/* Featured blog (first item) */}
            {featuredBlog && activeCategory === "All" && !search && page === 1 && (
              <div style={{ marginBottom: "2rem" }}>
                <FeaturedCard blog={featuredBlog} />
              </div>
            )}

            {/* Blog grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              {(activeCategory !== "All" || search || page > 1 ? blogs : gridBlogs).map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                    minHeight: 0,
                    opacity: page === 1 ? 0.4 : 1,
                  }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: p === page ? "#6366f1" : "transparent",
                        color: p === page ? "white" : "#64748b",
                        boxShadow: p === page ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                    minHeight: 0,
                    opacity: page === totalPages ? 0.4 : 1,
                  }}
                  aria-label="Next page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
