"use client";

import React from "react";
import { motion } from "framer-motion";

export interface PioneerData {
  id: string;
  name: string;
  role: string;
  era: string;
  startYear?: string;
  endYear?: string;
  location: string;
  biography: string;
  quote?: string;
  bgGradient: string;
  images?: string[];
}

interface PioneerCardProps {
  figure: PioneerData;
  onClick: () => void;
}

export default function PioneerCard({ figure, onClick }: PioneerCardProps) {
  return (
    <motion.div
      onClick={onClick}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-6 border-none space-y-4 shadow-none transition-all duration-300 overflow-hidden w-full relative"
    >
      {/* Top Header Row with Square Profile Box */}
      <div className="flex items-start gap-4 sm:gap-5 w-full overflow-hidden">
        {/* Square Pioneer Profile Box */}
        <div
          className={`w-24 h-24 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden relative ${
            !figure.images?.[0] ? "bg-gradient-to-br " + figure.bgGradient : "bg-slate-100"
          } flex flex-col justify-between text-white shadow-inner`}
        >
          {figure.images?.[0] ? (
            <img 
              src={figure.images[0]}
              alt={figure.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
            />
          ) : null}
        </div>

        {/* Title & Role Info Side Container */}
        <div className="space-y-1 overflow-hidden flex-1">
          <span className="text-xs font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
            {figure.role}
          </span>
          <h3 className="font-abyan-title text-base sm:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
            {figure.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-abyan-title">
            {figure.location && <span className="text-sky-600 truncate">{figure.location}</span>}
            {figure.location && (figure.startYear || figure.endYear) && <span className="text-slate-300 mx-0.5">•</span>}
            {(figure.startYear || figure.endYear) && (
              <span className="text-slate-500 truncate">
                {figure.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{figure.endYear}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Short Bio */}
      <div className="space-y-2 overflow-hidden w-full">
        <p className="text-xs text-slate-700 font-abyan-body font-normal line-clamp-3 leading-relaxed overflow-hidden break-words">
          {figure.biography}
        </p>
      </div>

      {/* Quote Excerpt if available */}
      {figure.quote && (
        <p className="text-xs text-sky-600 font-abyan-body font-normal leading-relaxed pt-1 line-clamp-2 overflow-hidden break-words w-full">
          « {figure.quote} »
        </p>
      )}

      {/* Footer Prompt */}
      <div className="pt-2 flex justify-end items-center text-xs text-sky-600 font-abyan-title overflow-hidden border-none">
        <span className="group-hover:translate-x-[-3px] transition-transform font-normal">
          معاينة ←
        </span>
      </div>
    </motion.div>
  );
}
