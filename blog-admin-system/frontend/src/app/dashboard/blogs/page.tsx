"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { ConfirmModal } from "@/components/Modal";
import { TableRowSkeleton, PageSpinner } from "@/components/Skeletons";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Search,
  PenSquare,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  EyeOff,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published";
  featuredImage: string;
  createdAt: string;
  author: string;
  views?: number;
}

const BlogsAdminContent = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; blogId: string; blogTitle: string }>({
    open: false,
    blogId: "",
    blogTitle: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, authLoading, router]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        admin: "true",
        page,
        limit: 8,
      };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const { data } = await api.get("/blogs", { params });
      setBlogs(data.blogs || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    if (isAuthenticated) fetchBlogs();
  }, [isAuthenticated, fetchBlogs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/blogs/${deleteModal.blogId}`);
      toast.success("Blog deleted successfully");
      setDeleteModal({ open: false, blogId: "", blogTitle: "" });
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    setToggleLoading(blog._id);
    try {
      const newStatus = blog.status === "published" ? "draft" : "published";
      await api.put(`/blogs/${blog._id}`, { status: newStatus });
      toast.success(`Blog ${newStatus === "published" ? "published" : "unpublished"} successfully`);
      fetchBlogs();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggleLoading(null);
    }
  };

  if (authLoading) return <PageSpinner />;
  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, blogId: "", blogTitle: "" })}
        onConfirm={handleDelete}
        title="Delete Blog Post?"
        message={`Are you sure you want to permanently delete "${deleteModal.blogTitle}"? This action cannot be undone.`}
        isLoading={deleting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
            Blog Posts
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} {total === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Link href="/dashboard/blogs/create" className="btn btn-primary">
          <PenSquare size={16} />
          New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search blogs by title, description or tags..."
              className="form-input pl-9 py-2.5 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search blogs"
            />
          </div>
          <select
            className="form-input py-2.5 text-sm w-full sm:w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table" aria-label="Blog posts table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <TableRowSkeleton key={i} />)
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText size={22} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium text-sm">No blogs found</p>
                      <p className="text-slate-400 text-xs">
                        {search || statusFilter !== "all"
                          ? "Try adjusting your filters."
                          : "Create your first blog post."}
                      </p>
                      {!search && statusFilter === "all" && (
                        <Link href="/dashboard/blogs/create" className="btn btn-primary text-xs mt-1 px-4 py-2 min-h-0">
                          <PenSquare size={13} /> Create Blog
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {blog.featuredImage ? (
                          <Image
                            src={`${BACKEND_URL}${blog.featuredImage}`}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <p className="font-semibold text-slate-800 text-sm leading-snug max-w-[280px] truncate">
                        {blog.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">by {blog.author}</p>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {blog.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${blog.status === "published" ? "badge-published" : "badge-draft"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {blog.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {/* View */}
                        <Link
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View live"
                          aria-label="View blog"
                        >
                          <Eye size={15} />
                        </Link>

                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(blog)}
                          disabled={toggleLoading === blog._id}
                          className={`p-2 rounded-lg transition-colors ${
                            blog.status === "published"
                              ? "hover:bg-amber-50 text-slate-400 hover:text-amber-600"
                              : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"
                          }`}
                          title={blog.status === "published" ? "Unpublish" : "Publish"}
                          aria-label={blog.status === "published" ? "Unpublish blog" : "Publish blog"}
                        >
                          {toggleLoading === blog._id ? (
                            <span className="w-3.5 h-3.5 border border-slate-300 border-t-slate-600 rounded-full animate-spin block" />
                          ) : blog.status === "published" ? (
                            <EyeOff size={15} />
                          ) : (
                            <Globe size={15} />
                          )}
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/dashboard/blogs/edit/${blog._id}`}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit blog"
                          aria-label="Edit blog"
                        >
                          <Edit size={15} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, blogId: blog._id, blogTitle: blog.title })
                          }
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete blog"
                          aria-label="Delete blog"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary text-xs px-3 py-1.5 min-h-0 flex items-center gap-1"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary text-xs px-3 py-1.5 min-h-0 flex items-center gap-1"
                aria-label="Next page"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default function BlogsPage() {
  return (
    <AuthProvider>
      <BlogsAdminContent />
    </AuthProvider>
  );
}
