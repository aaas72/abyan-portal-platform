"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ImageShowcaseData {
  id: string;
  title: string;
  tag?: string;
  location?: string;
  year?: string;
  startYear?: string;
  endYear?: string;
  description: string;
  bgGradient?: string;
  images?: string[];
  aspectRatio?: string;
}

const FALLBACK_GRADIENTS = [
  "from-emerald-900 via-sky-900 to-slate-900",
  "from-sky-900 via-emerald-800 to-slate-900",
  "from-slate-800 via-sky-800 to-emerald-900",
  "from-emerald-800 to-sky-900",
  "from-sky-800 to-slate-800",
];

function getGradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

interface ImageShowcaseCardProps {
  item: ImageShowcaseData;
  onClick?: () => void;
}

export default function ImageShowcaseCard({
  item,
  onClick,
}: ImageShowcaseCardProps) {
  return (
    <motion.div
      onClick={onClick}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-4 border-none space-y-3 shadow-none overflow-hidden w-full relative"
    >
      {/* Full-Width Aspect Photo Box on Top */}
      <div
        className={`w-full ${
          item.aspectRatio || "aspect-[4/3]"
        } rounded-xl overflow-hidden relative ${
          !item.images?.[0] ? "bg-gradient-to-br " + (item.bgGradient || getGradientForId(item.id)) : "bg-slate-100"
        } flex flex-col justify-between text-white shadow-inner`}
      >
        {item.images?.[0] ? (
          <img 
            src={item.images[0]} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" 
          />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
      </div>

      {/* Title & Short Description Below Photo Box */}
      <div className="space-y-1 overflow-hidden">
        {item.tag && (
          <span className="text-xs font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
            {item.tag}
          </span>
        )}
        <h3 className="font-abyan-title text-sm sm:text-base font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
          {item.title}
        </h3>
        {item.location && (
          <span className="text-[13px] font-normal text-sky-700 font-abyan-title block break-words leading-snug">
            {item.location}
          </span>
        )}
        {(item.startYear || item.endYear || item.year) && (
          <span className="text-[12px] font-normal text-slate-500 font-abyan-title block break-words leading-snug">
             {item.startYear || item.endYear ? (item.startYear || "") + " - " + (item.endYear || "") : item.year}
          </span>
        )}
        <p className="text-[11px] text-slate-600 font-abyan-body font-normal line-clamp-2 leading-relaxed overflow-hidden">
          {item.description}
        </p>
      </div>

      {/* Prompt Link */}
      <div className="pt-1 text-left text-xs text-sky-600 font-abyan-title border-none">
        <span className="group-hover:translate-x-[-3px] transition-transform font-normal inline-block">
          معاينة ←
        </span>
      </div>
    </motion.div>
  );
}
