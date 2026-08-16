"use client";

import React from "react";

export interface CategoryOption {
  value: string;
  label: string;
}

interface AdminSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categoryOptions?: CategoryOption[];
  categoryPlaceholder?: string;
  totalCount?: number;
  filteredCount?: number;
  className?: string;
}

export default function AdminSearchFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "بحث بالاسم، اللقب، أو التفاصيل...",
  categoryFilter = "",
  onCategoryChange,
  categoryOptions = [],
  categoryPlaceholder = "كل الفئات والأقسام",
  totalCount,
  filteredCount,
  className = "",
}: AdminSearchFilterBarProps) {
  const hasActiveFilter = searchQuery.trim().length > 0 || (categoryFilter !== "" && categoryFilter !== "all");

  const handleReset = () => {
    onSearchChange("");
    if (onCategoryChange) {
      onCategoryChange("");
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full ${className}`}
      dir="rtl"
    >
      {/* Search Input Box */}
      <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-abyan-body text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all duration-200"
        />
        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-abyan-title text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors border-none cursor-pointer"
          >
            مسح
          </button>
        )}
      </div>

      {/* Category Dropdown (if options provided) */}
      {categoryOptions.length > 0 && onCategoryChange && (
        <div className="shrink-0 min-w-[150px] sm:min-w-[190px]">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-abyan-title text-slate-800 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[left_12px_center] bg-no-repeat pl-8"
          >
            <option value="">{categoryPlaceholder}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active Filter Indicators / Clear All */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 shrink-0">
          {filteredCount !== undefined && totalCount !== undefined && (
            <span className="text-xs font-abyan-body text-slate-500">
              ({filteredCount} من {totalCount})
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-abyan-title text-sky-600 hover:text-sky-700 bg-transparent border-none cursor-pointer underline whitespace-nowrap p-0"
          >
            إلغاء التصفية
          </button>
        </div>
      )}
    </div>
  );
}
