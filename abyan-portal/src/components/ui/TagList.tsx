"use client";

import React from "react";

export interface TagListProps {
  items: string[];
  title?: string;
  variant?: "pure-text" | "pill" | "badge";
  color?: "sky" | "emerald" | "slate" | "gradient";
  separator?: string;
  className?: string;
}

export default function TagList({
  items,
  title,
  variant = "pill",
  color = "gradient",
  separator = "•",
  className = "",
}: TagListProps) {
  if (!items || items.length === 0) return null;

  const textColors = {
    sky: "text-sky-600",
    emerald: "text-[#10b981]",
    slate: "text-slate-700",
    gradient: "text-sky-600",
  };

  const pillColors = {
    sky: "bg-sky-50/80 text-sky-700 hover:bg-sky-100/90",
    emerald: "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/90",
    slate: "bg-slate-50/90 text-slate-800 hover:bg-slate-100",
    gradient:
      "bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-emerald-100/90 hover:to-sky-100/90 text-slate-900 border-none shadow-none",
  };

  return (
    <div className={`space-y-1.5 text-right ${className}`}>
      {title && (
        <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
{title}
</h4>
      )}

      {variant === "pill" || variant === "badge" ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={`text-xs font-abyan-title font-normal transition-colors cursor-default ${
                variant === "pill" ? "px-3 py-1 rounded-full" : "px-2.5 py-1 rounded-lg"
              } ${pillColors[color]}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        /* Pure Text List separated by dots */
        <p className={`text-xs sm:text-sm font-abyan-body font-normal leading-relaxed ${textColors[color]}`}>
          {items.join(` ${separator} `)}
        </p>
      )}
    </div>
  );
}
