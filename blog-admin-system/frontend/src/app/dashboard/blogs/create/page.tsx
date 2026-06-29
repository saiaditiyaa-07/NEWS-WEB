"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import RichTextEditor from "@/components/RichTextEditor";
import { PageSpinner } from "@/components/Skeletons";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Upload, X, Plus, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Technology",
  "Design",
  "Business",
  "Lifestyle",
  "Education",
  "Travel",
  "Health",
  "Finance",
  "Science",
  "Other",
];

const CreateBlogContent = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, authLoading, router]);

  // Auto-generate slug from title
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  }, [title]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Short description is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (!category) newErrors.category = "Category is required";
    if (!imageFile) newErrors.image = "Featured image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("author", author);
      formData.append("status", status);
      formData.append("tags", JSON.stringify(tags));
      if (imageFile) formData.append("featuredImage", imageFile);

      await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog post created successfully!");
      router.push("/dashboard/blogs");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <PageSpinner />;
  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <Link
            href="/dashboard/blogs"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Back to blogs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
              Create New Blog
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Fill in the details to publish your post.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Post Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="blog-title" className="form-label">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="blog-title"
                      type="text"
                      placeholder="Enter an engaging blog title..."
                      className={`form-input ${errors.title ? "error" : ""}`}
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="blog-slug" className="form-label">
                      Slug <span className="text-xs text-slate-400 font-normal">(auto-generated)</span>
                    </label>
                    <input
                      id="blog-slug"
                      type="text"
                      placeholder="auto-generated-from-title"
                      className="form-input bg-slate-50 text-slate-500 text-sm"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    />
                  </div>

                  <div>
                    <label htmlFor="blog-description" className="form-label">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="blog-description"
                      rows={3}
                      placeholder="Write a brief summary of the blog post (shown in listings)..."
                      className={`form-input resize-none ${errors.description ? "error" : ""}`}
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="card p-5">
                <label className="form-label mb-3 block">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={content}
                  onChange={(val) => { setContent(val); setErrors((p) => ({ ...p, content: "" })); }}
                  placeholder="Start writing your blog content here..."
                  error={errors.content}
                />
                {errors.content && <p className="mt-1.5 text-xs text-red-500">{errors.content}</p>}
              </div>
            </div>

            {/* Sidebar settings */}
            <div className="space-y-5">
              {/* Publish settings */}
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Publish Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Status</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setStatus("draft")}
                        className={`flex-1 py-2 text-sm font-medium transition-all ${
                          status === "draft"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus("published")}
                        className={`flex-1 py-2 text-sm font-medium transition-all ${
                          status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        Published
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="blog-category" className="form-label">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="blog-category"
                      className={`form-input ${errors.category ? "error" : ""}`}
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: "" })); }}
                    >
                      <option value="">Select category...</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                  </div>

                  <div>
                    <label htmlFor="blog-author" className="form-label">Author</label>
                    <input
                      id="blog-author"
                      type="text"
                      className="form-input"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="card p-5">
                <label className="form-label mb-3 block">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow hover:bg-white transition-colors text-slate-600"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                      errors.image
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 bg-slate-50"
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload featured image"
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <ImageIcon size={20} className="text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-600">
                        <span className="text-indigo-600">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <Upload size={16} className="text-slate-300" />
                  </div>
                )}
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  aria-label="Featured image file input"
                />
              </div>

              {/* Tags */}
              <div className="card p-5">
                <label className="form-label mb-3 block">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="form-input text-sm flex-1 py-2"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    aria-label="Tag input"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn btn-secondary px-3 py-2 min-h-0 text-sm"
                    aria-label="Add tag"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                id="create-blog-submit-btn"
                className="btn btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  `${status === "published" ? "Publish" : "Save as Draft"} Blog`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default function CreateBlogPage() {
  return (
    <AuthProvider>
      <CreateBlogContent />
    </AuthProvider>
  );
}
