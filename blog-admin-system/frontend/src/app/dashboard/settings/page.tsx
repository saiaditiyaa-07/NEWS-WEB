"use client";

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { PageSpinner } from "@/components/Skeletons";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SettingsContent = () => {
  const { isAuthenticated, isLoading: authLoading, admin } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <PageSpinner />;
  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your admin account information.</p>
        </div>

        <div className="card p-6 mb-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-5">Profile Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
              <span className="text-white text-2xl font-bold">{admin?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">{admin?.name}</p>
              <p className="text-slate-400 text-sm">{admin?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">Administrator</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="form-label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="settings-name" type="text" className="form-input pl-10" defaultValue={admin?.name || ""} placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label htmlFor="settings-email" className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="settings-email" type="email" className="form-input pl-10 bg-slate-50 text-slate-500" defaultValue={admin?.email || ""} disabled />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed from this panel.</p>
            </div>
            <button className="btn btn-primary text-sm px-5" onClick={() => toast.success("Profile update coming soon!")} type="button">
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-5">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="form-label">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="current-password" type={showPassword ? "text" : "password"} className="form-input pl-10 pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="form-label">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="new-password" type="password" className="form-input pl-10" placeholder="Min. 6 characters" />
              </div>
            </div>
            <button className="btn btn-secondary text-sm px-5" onClick={() => toast.success("Password update coming soon!")} type="button">
              <Lock size={15} /> Update Password
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function SettingsPage() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  );
}
