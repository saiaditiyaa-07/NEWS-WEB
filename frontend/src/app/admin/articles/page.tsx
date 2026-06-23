"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, Plus, Edit, Trash2, X, CheckCircle, 
  ArrowLeft, Search, Loader2, RefreshCw, Star, Sparkles 
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
  trending: boolean;
  editors_pick: boolean;
  tags: string[];
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formSuccess, setFormSuccess] = useState("");

  // Form inputs
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Technology");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [trending, setTrending] = useState(false);
  const [editorsPick, setEditorsPick] = useState(false);

  const categories = ["Technology", "Science", "Business", "Politics", "Entertainment"];

  // Fetch articles on load
  const loadArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        throw new Error("Bad response from server");
      }
    } catch (err) {
      setError("Could not index articles database. Check backend server.");
      setArticles([
        {
          id: "1",
          title: "The Silicon Horizon: Quantum Photonic Accelerators Enter Commercial Fab Production",
          summary: "Electronic computing is approaching physical silicon limits.",
          content: "Full content text here...",
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
          category: "Technology",
          author: "Dr. Aris Thorne",
          published_at: "2026-06-23T10:30:00Z",
          views: 41250,
          reading_time: 4,
          trending: true,
          editors_pick: true,
          tags: ["Silicon Photonics", "Quantum Computing"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle("");
    setAuthor("");
    setCategory("Technology");
    setSummary("");
    setContent("");
    setImage("");
    setTagsInput("");
    setTrending(false);
    setEditorsPick(false);
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setAuthor(art.author);
    setCategory(art.category);
    setSummary(art.summary);
    setContent(art.content);
    setImage(art.image);
    setTagsInput(art.tags ? art.tags.join(", ") : "");
    setTrending(art.trending || false);
    setEditorsPick(art.editors_pick || false);
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this news entry?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setArticles(articles.filter((art) => art.id !== id));
      }
    } catch (err) {
      alert("Could not remove article from database.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      author,
      category,
      summary,
      content,
      image: image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80",
      tags: tagsArray,
      trending,
      editors_pick: editorsPick
    };

    try {
      let res;
      if (editingArticle) {
        res = await fetch(`http://127.0.0.1:8000/api/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://127.0.0.1:8000/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setFormSuccess(editingArticle ? "Entry updated successfully!" : "Entry created successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          loadArticles();
        }, 1000);
      } else {
        throw new Error();
      }
    } catch (err) {
      const mockResult: Article = {
        id: editingArticle ? editingArticle.id : String(articles.length + 1),
        title,
        author,
        category,
        summary,
        content,
        image: image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80",
        published_at: editingArticle ? editingArticle.published_at : new Date().toISOString(),
        views: editingArticle ? editingArticle.views : 0,
        reading_time: Math.max(1, content.split(" ").length / 200),
        trending,
        editors_pick: editorsPick,
        tags: tagsArray
      };

      if (editingArticle) {
        setArticles(articles.map(a => a.id === editingArticle.id ? mockResult : a));
      } else {
        setArticles([mockResult, ...articles]);
      }
      setFormSuccess("Offline simulation updated!");
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q)
    );
  });

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 min-h-screen bg-white text-gray-900 transition-colors">
      
      {/* Return Navigation */}
      <div className="mb-6 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-400">
        <Link href="/admin" className="hover:text-[#d60000] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 text-[#d60000]" />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="serif-title text-2xl font-black text-[#003366] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#d60000]" />
            <span>CMS Article Manager</span>
          </h1>
          <p className="text-xs text-gray-555 font-semibold mt-1">
            Create, update, search, and delete articles directly.
          </p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#d60000] hover:bg-[#b50000] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Entry</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-6">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search database listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
        
        <button 
          onClick={loadArticles} 
          className="p-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-[#d60000] transition-all w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white"
          title="Reload listings"
        >
          <RefreshCw className="w-4 h-4 text-[#003366]" />
          <span className="sm:hidden font-bold text-xs uppercase tracking-wider">Reload index</span>
        </button>
      </div>

      {/* Table grid */}
      <div className="pt-6">
        {loading ? (
          <div className="h-40 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d60000]" />
            <p className="text-xs font-bold text-gray-400">Loading catalog indexing...</p>
          </div>
        ) : error && articles.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-red-500 border border-red-200 bg-red-50/20 rounded">
            {error}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 border border-dashed border-gray-300 rounded text-center text-gray-400">
            No database entries match. Try adjusting terms.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              
              <thead className="bg-[#f8f9fa] text-gray-500 uppercase tracking-wider font-bold text-[9px]">
                <tr>
                  <th className="p-4">Report Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4 text-center">Views</th>
                  <th className="p-4 text-center">Badges</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="p-4 max-w-sm">
                      <div className="space-y-1">
                        <Link 
                          href={`/article/${art.id}`}
                          className="serif-title font-black text-gray-900 hover:text-[#d60000] transition-colors block line-clamp-1"
                        >
                          {art.title}
                        </Link>
                        <span className="text-[10px] text-gray-550 font-bold">ID: {art.id} • Published: {new Date(art.published_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${getBadgeClass(art.category)}`}>
                        {art.category}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700">{art.author}</td>

                    <td className="p-4 text-center font-bold">{(art.views || 0).toLocaleString()}</td>

                    <td className="p-4 text-center">
                      <div className="flex gap-1.5 justify-center">
                        {art.editors_pick && (
                          <span title="Editor's Pick">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          </span>
                        )}
                        {art.trending && (
                          <span title="Trending">
                            <Sparkles className="w-3.5 h-3.5 text-[#d60000] fill-[#d60000]" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded border border-gray-200 hover:border-[#d60000] hover:text-[#d60000] text-gray-500 transition-colors bg-white"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#003366]" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 rounded border border-gray-200 hover:border-red-500 hover:text-red-500 text-gray-500 transition-colors bg-white"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded border border-gray-200 p-6 md:p-8 space-y-6 shadow-2xl relative animate-zoom-in my-8 max-h-[90vh] overflow-y-auto text-gray-900">
            
            {formSuccess && (
              <div className="absolute inset-0 bg-white/95 rounded z-10 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 animate-pulse" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{formSuccess}</h3>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="serif-title text-sm font-black text-gray-900 uppercase tracking-wide">
                {editingArticle ? "Modify Briefing" : "Draft New Intelligence Report"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-400"
              >
                <X className="w-4 h-4 text-[#d60000]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-gray-600">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="uppercase tracking-wider text-[9px]">Report Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter headline..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider text-[9px]">Author Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider text-[9px]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="uppercase tracking-wider text-[9px]">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Photo link..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="uppercase tracking-wider text-[9px]">Index Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Silicon Photonics, AI infrastructure..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="uppercase tracking-wider text-[9px]">Executive Summary</label>
                  <textarea
                    required
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summary snippet..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="uppercase tracking-wider text-[9px]">Report Content Body</label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Full body paragraphs..."
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] placeholder:text-gray-400 text-gray-900 font-semibold"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-gray-700">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark Trending</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-gray-700">
                  <input
                    type="checkbox"
                    checked={editorsPick}
                    onChange={(e) => setEditorsPick(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark Editor's Pick</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded font-bold hover:bg-gray-50 transition-colors text-gray-700 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded shadow-sm transition-colors"
                >
                  {editingArticle ? "Save Changes" : "Publish Report"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
