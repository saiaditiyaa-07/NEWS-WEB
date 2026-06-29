"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Rss,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/blogs", label: "All Blogs", icon: FileText },
  { href: "/dashboard/blogs/create", label: "Create Blog", icon: PenSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Rss size={15} className="text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>
          Blog<span className="text-indigo-600">CMS</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 mb-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{admin?.name || "Admin"}</p>
            <p className="text-xs text-slate-400 truncate">{admin?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Logout"
        >
          <LogOut size={18} className="flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-100 flex-shrink-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="sidebar-overlay lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden flex flex-col animate-fade-up">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0 shadow-sm">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open sidebar"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Page breadcrumb hint - desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-slate-700">Admin Panel</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Bell */}
            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                aria-label="Admin profile"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                  {admin?.name || "Admin"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-10 animate-fade-up">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 truncate">{admin?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={15} /> Settings
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
