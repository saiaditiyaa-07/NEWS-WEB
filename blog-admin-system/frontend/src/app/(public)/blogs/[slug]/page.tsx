import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import { BlogHeroImage, RelatedBlogImage } from "@/components/BlogImages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  author: string;
  featuredImage: string;
  createdAt: string;
  tags?: string[];
  readingTime?: number;
  views?: number;
}

async function getBlogBySlug(slug: string): Promise<{ blog: Blog; relatedBlogs: Blog[] } | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);
  if (!data) return { title: "Blog Not Found" };
  return {
    title: data.blog.title,
    description: data.blog.description,
    openGraph: {
      title: data.blog.title,
      description: data.blog.description,
      type: "article",
    },
  };
}

// Safely render markdown-ish content
function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## "))
      return (
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          {line.substring(3)}
        </h2>
      );
    if (line.startsWith("### "))
      return (
        <h3 key={i} className="text-xl font-bold text-slate-800 mt-7 mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
          {line.substring(4)}
        </h3>
      );
    if (line.startsWith("> "))
      return (
        <blockquote key={i} className="border-l-4 border-indigo-500 pl-5 py-3 my-6 bg-indigo-50/60 rounded-r-xl italic text-slate-600 text-lg leading-relaxed">
          {line.substring(2)}
        </blockquote>
      );
    if (line.startsWith("- "))
      return (
        <li key={i} className="ml-6 text-slate-600 leading-7 list-disc mb-1">
          {line.substring(2)}
        </li>
      );
    if (line.match(/^\d+\. /))
      return (
        <li key={i} className="ml-6 text-slate-600 leading-7 list-decimal mb-1">
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    if (!line.trim()) return <div key={i} className="h-2" />;

    // Handle bold/italic/code inline without event handlers
    const processed = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>");

    return (
      <p
        key={i}
        className="text-slate-600 leading-8 mb-4 text-base"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <Tag size={32} className="text-slate-300" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
            Post Not Found
          </h1>
          <p className="text-slate-500 mb-6">This blog post doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { blog, relatedBlogs } = data;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href={`/?category=${blog.category}`} className="hover:text-indigo-600 transition-colors">
            {blog.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-500 truncate max-w-xs">{blog.title}</span>
        </nav>

        {/* Category */}
        <span className="inline-block mb-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
          {blog.category}
        </span>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {blog.title}
        </h1>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-100">
          <span className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {blog.author?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-slate-600">{blog.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {blog.readingTime || 1} min read
          </span>
          {blog.views && blog.views > 0 ? (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {blog.views.toLocaleString()} views
            </span>
          ) : null}
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <BlogHeroImage src={blog.featuredImage} alt={blog.title} />
        )}

        {/* Description pull quote */}
        <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
          <p className="text-lg text-slate-600 leading-relaxed italic">{blog.description}</p>
        </div>

        {/* Main content */}
        <div className="prose-content mb-12">
          {renderContent(blog.content)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 pt-6 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
              <Tag size={14} /> Tags:
            </span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
            <span className="text-white text-2xl font-bold">
              {blog.author?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-base">{blog.author}</p>
            <p className="text-sm text-slate-500">Author & Content Creator at BlogCMS</p>
          </div>
        </div>

        {/* Related posts */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold text-slate-900 mb-5"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBlogs.map((related) => (
                <Link
                  key={related._id}
                  href={`/blogs/${related.slug}`}
                  className="card p-4 hover:shadow-md transition-all group block"
                >
                  {related.featuredImage && (
                    <RelatedBlogImage src={related.featuredImage} alt={related.title} />
                  )}
                  <span className="text-xs text-indigo-600 font-semibold mb-1.5 block">
                    {related.category}
                  </span>
                  <h3
                    className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {related.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Clock size={11} /> {related.readingTime || 1} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
