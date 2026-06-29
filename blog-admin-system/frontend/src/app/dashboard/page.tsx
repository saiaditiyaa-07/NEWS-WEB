"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { StatCardSkeleton, PageSpinner } from "@/components/Skeletons";
import api from "@/lib/api";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  PenSquare,
  Eye,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  latestBlog: {
    _id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
    slug: string;
  } | null;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  sub?: string;
  delay?: number;
}

const StatCard = ({ label, value, icon, gradient, sub, delay = 0 }: StatCardProps) => (
  <div
    className="card p-6"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
        {icon}
      </div>
    </div>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
);

const DashboardContent = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/blogs/admin/stats");
        setStats(data.stats);
      } catch {
        // fallback: use empty data
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated]);

  if (authLoading) return <PageSpinner />;
  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back! Here&apos;s an overview of your blog.
          </p>
        </div>
        <Link href="/dashboard/blogs/create" className="btn btn-primary">
          <PenSquare size={16} />
          New Blog
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Blogs"
              value={stats?.totalBlogs || 0}
              icon={<FileText size={22} className="text-white" />}
              gradient="gradient-primary"
              sub="All blog posts created"
              delay={0}
            />
            <StatCard
              label="Published"
              value={stats?.publishedBlogs || 0}
              icon={<CheckCircle size={22} className="text-white" />}
              gradient="gradient-success"
              sub="Live and publicly visible"
              delay={50}
            />
            <StatCard
              label="Drafts"
              value={stats?.draftBlogs || 0}
              icon={<Clock size={22} className="text-white" />}
              gradient="gradient-warning"
              sub="Saved but not published"
              delay={100}
            />
            <StatCard
              label="Avg. Views"
              value={stats?.totalBlogs ? Math.round((stats?.publishedBlogs || 0) * 12) : 0}
              icon={<TrendingUp size={22} className="text-white" />}
              gradient="gradient-info"
              sub="Estimated public reach"
              delay={150}
            />
          </>
        )}
      </div>

      {/* Latest Blog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Latest post card */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">Latest Blog Post</h2>
            <Link
              href="/dashboard/blogs"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          ) : stats?.latestBlog ? (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-slate-800 leading-snug">
                    {stats.latestBlog.title}
                  </h3>
                  <span
                    className={`badge flex-shrink-0 ${
                      stats.latestBlog.status === "published" ? "badge-published" : "badge-draft"
                    }`}
                  >
                    {stats.latestBlog.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(stats.latestBlog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                    {stats.latestBlog.category}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/blogs/edit/${stats.latestBlog._id}`}
                    className="btn btn-secondary text-xs px-3 py-1.5 min-h-0"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/blogs/${stats.latestBlog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs px-3 py-1.5 min-h-0 flex items-center gap-1"
                  >
                    <Eye size={13} /> View Live
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <FileText size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-sm">No blogs yet</p>
              <p className="text-slate-400 text-xs mt-1 mb-4">Create your first blog post to get started.</p>
              <Link href="/dashboard/blogs/create" className="btn btn-primary text-xs px-4 py-2 min-h-0">
                <PenSquare size={13} /> Create Blog
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/dashboard/blogs/create", label: "Write New Blog", icon: <PenSquare size={16} />, color: "text-indigo-600 bg-indigo-50" },
              { href: "/dashboard/blogs", label: "Manage Blogs", icon: <FileText size={16} />, color: "text-emerald-600 bg-emerald-50" },
              { href: "/", label: "View Public Site", icon: <Eye size={16} />, color: "text-blue-600 bg-blue-50", external: true },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {action.label}
                </span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
