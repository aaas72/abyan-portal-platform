"use client";

import React from "react";
import { ContentSource } from "@/types/schemas";

export interface AdminSourcesInputProps {
  label?: string;
  sources?: ContentSource[];
  onChange: (sources: ContentSource[]) => void;
  error?: string;
  containerClassName?: string;
}

export default function AdminSourcesInput({
  label = "المصادر والمراجع التوثيقية (اختياري)",
  sources = [],
  onChange,
  error,
  containerClassName = "",
}: AdminSourcesInputProps) {
  const handleAddSource = () => {
    onChange([...sources, { name: "", url: "" }]);
  };

  const handleRemoveSource = (index: number) => {
    const updated = sources.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    const updated = [...sources];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className={`space-y-3 ${containerClassName}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-abyan-title text-slate-700 font-normal">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAddSource}
          className="text-xs font-abyan-title text-[#10b981] hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer font-bold px-2 py-1 rounded-lg hover:bg-emerald-50"
        >
          إضافة مصدر آخر +
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="p-3 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-xs text-slate-500 font-abyan-body">
            لا توجد مصادر مضافة حالياً. يمكنك إضافة روابط ومراجع توثيقية إضافية عبر النقر على زر الإضافة أعلاه.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-abyan-title font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={src.name || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "name", e.target.value)
                  }
                  placeholder="اسم المصدر / المرجع (مثال: كتاب أعلام أبين)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#10b981] font-abyan-body"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  value={src.url || ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "url", e.target.value)
                  }
                  placeholder="رابط المصدر (اختياري - https://...)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 font-abyan-body text-left dir-ltr"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSource(idx)}
                className="px-2 py-1 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-abyan-title shrink-0 cursor-pointer self-end sm:self-center"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-500 font-abyan-body font-normal">
          {error}
        </p>
      )}
    </div>
  );
}
