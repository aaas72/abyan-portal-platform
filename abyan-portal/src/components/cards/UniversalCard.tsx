"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface UniversalCardData {
  id?: string;
  category?: string;
  title: string;
  subtitle?: string;
  description: string;
  linkText?: string;
  href?: string;
  era?: string;
  startYear?: string;
  endYear?: string;
  location?: string;
  quote?: string;
  bgGradient?: string;
  aspectRatio?: string;
  images?: string[];
}

interface UniversalCardProps {
  data: UniversalCardData;
  onClick?: () => void;
  variant?: "highlight" | "pioneer" | "food" | "plain" | "stat";
}

export default function UniversalCard({
  data,
  onClick,
  variant = "highlight",
}: UniversalCardProps) {
  // VARIANT 1: STAT CARD (CENTERED TEXT WITH GRADIENT BACKGROUND)
  if (variant === "stat") {
    return (
      <motion.div
        onClick={onClick}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-5 border-none space-y-2 shadow-none overflow-hidden w-full relative"
      >
        {data.category && (
          <span className="text-sm font-normal text-[#10b981] font-abyan-title block">
            {data.category}
          </span>
        )}
        <span className="block font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal leading-none group-hover:text-sky-600 transition-colors">
          {data.title}
        </span>
        <p className="text-sm text-slate-600 font-abyan-body font-normal">
          {data.description}
        </p>
      </motion.div>
    );
  }

  // VARIANT 2: FOOD CARD (VERTICAL LAYOUT: TOP FULL-WIDTH SQUARE IMAGE BOX + TEXT UNDERNEATH)
  if (variant === "food") {
    return (
      <motion.div
        onClick={onClick}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-4 border-none space-y-3 shadow-none overflow-hidden w-full relative"
      >
        {/* Full-Width Aspect-Square Food Photo Box on Top */}
        <div
          className={`w-full aspect-square rounded-xl overflow-hidden relative bg-gradient-to-br ${
            data.bgGradient || "from-emerald-900 via-sky-900 to-slate-900"
          } flex flex-col justify-between text-white shadow-inner`}
        >
          {data.images?.[0] ? (
            <img
              src={data.images[0]}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          )}
        </div>

        {/* Title & Short Description Below Photo Box */}
        <div className="space-y-1 overflow-hidden">
          {data.category && (
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
              {data.category}
            </span>
          )}
          <h3 className="font-abyan-title text-base sm:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
            {data.title}
          </h3>
          {data.location && (
            <span className="text-[13px] font-normal text-sky-700 font-abyan-title block break-words leading-snug">
              {data.location}
            </span>
          )}
          <p className="text-[11px] text-slate-600 font-abyan-body font-normal line-clamp-2 leading-relaxed overflow-hidden">
            {data.description}
          </p>
        </div>
      </motion.div>
    );
  }

  // VARIANT 2: PIONEER CARD (HORIZONTAL LAYOUT: SIDE SQUARE PROFILE BOX + TITLE/ROLE/BIO NEXT TO IT)
  if (variant === "pioneer") {
    return (
      <motion.div
        onClick={onClick}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-6 border-none shadow-none transition-all duration-300 overflow-hidden w-full relative"
      >
        {/* Row with Side Square Profile Box and Content */}
        <div className="flex items-stretch gap-4 sm:gap-5 w-full overflow-hidden">
          <div
            className={`w-24 h-24 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden relative bg-gradient-to-br ${
              data.bgGradient || "from-emerald-50 via-white to-sky-50"
            } flex flex-col justify-between shadow-inner`}
          >
            {data.images?.[0] ? (
              <img
                src={data.images[0]}
                alt={data.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]" />
            )}
          </div>

          {/* Title, Role & Button Side Container */}
          <div className="flex flex-col justify-between flex-1 py-1 overflow-hidden">
            <div className="space-y-1 overflow-hidden">
              {data.category && (
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
                  {data.category}
                </span>
              )}
              <h3 className="font-abyan-title text-base sm:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
                {data.title}
              </h3>
              {data.subtitle && (
                <span className="text-[13px] font-normal text-sky-700 font-abyan-title block break-words leading-snug">
                  {data.subtitle}
                </span>
              )}
              {/* Info details moved from image */}
              {data.location && (
                <span className="text-[12px] font-normal text-sky-600 font-abyan-title block break-words leading-snug mt-1">
                  {data.location}
                </span>
              )}
              {(data.startYear || data.endYear || data.era) && (
                <span className="text-[12px] font-normal text-slate-500 font-abyan-title block break-words leading-snug">
                  {data.startYear || data.endYear ? <>{data.startYear || ""}&nbsp;&nbsp;-&nbsp;&nbsp;{data.endYear || ""}</> : data.era}
                </span>
              )}
            </div>

            {/* Footer Prompt */}
            <div className="flex justify-end items-center text-xs text-sky-600 font-abyan-title overflow-hidden border-none mt-auto">
              <span className="group-hover:translate-x-[-3px] transition-transform font-normal">
                معاينة ←
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // VARIANT 3: HIGHLIGHT & PLAIN CARD (PURE TYPOGRAPHY LINKED CARD)
  const cardContent = (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group cursor-pointer text-right bg-transparent border-none pb-6 mb-2 space-y-3 shadow-none transition-all duration-300 overflow-hidden w-full relative"
    >
      <div className="space-y-1 overflow-hidden">
        {data.category && (
          <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block">
            {data.category}
          </span>
        )}
        <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal group-hover:text-sky-600 transition-colors leading-snug">
          {data.title}
        </h3>
      </div>

      <div className="space-y-2 overflow-hidden w-full">
        <p className="text-xs sm:text-sm text-slate-700 font-abyan-body font-normal leading-relaxed line-clamp-3 overflow-hidden break-words">
          {data.description}
        </p>
      </div>

      {data.linkText && (
        <div className="pt-2">
          <span className="text-xs sm:text-sm text-sky-600 font-abyan-title font-normal group-hover:translate-x-[-4px] transition-transform inline-block">
            {data.linkText}
          </span>
        </div>
      )}
    </motion.div>
  );

  if (data.href) {
    return (
      <Link href={data.href} className="no-underline block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
