"use client";

import React from "react";

// Card skeleton for dashboard stat cards
export const StatCardSkeleton = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="skeleton h-4 w-24 mb-2 rounded" />
        <div className="skeleton h-8 w-16 rounded" />
      </div>
      <div className="skeleton h-12 w-12 rounded-xl" />
    </div>
    <div className="skeleton h-3 w-32 rounded" />
  </div>
);

// Table row skeleton
export const TableRowSkeleton = () => (
  <tr>
    <td className="px-4 py-3">
      <div className="skeleton h-12 w-16 rounded-lg" />
    </td>
    <td className="px-4 py-3">
      <div className="skeleton h-4 w-48 rounded mb-1" />
      <div className="skeleton h-3 w-32 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="skeleton h-4 w-20 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="skeleton h-6 w-20 rounded-full" />
    </td>
    <td className="px-4 py-3">
      <div className="skeleton h-4 w-24 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex gap-2">
        <div className="skeleton h-8 w-8 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
    </td>
  </tr>
);

// Blog card skeleton for public listing
export const BlogCardSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="skeleton h-48 w-full" />
    <div className="p-5">
      <div className="skeleton h-3 w-20 rounded-full mb-3" />
      <div className="skeleton h-5 w-full rounded mb-2" />
      <div className="skeleton h-5 w-3/4 rounded mb-3" />
      <div className="skeleton h-3 w-full rounded mb-1" />
      <div className="skeleton h-3 w-5/6 rounded mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-6 rounded-full" />
        <div className="skeleton h-3 w-24 rounded mt-1" />
      </div>
    </div>
  </div>
);

// Full page loading spinner
export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-slate-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);
