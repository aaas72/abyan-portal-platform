"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import { ContentSource } from "@/types/schemas";
import { getOptimizedImageUrl } from "@/lib/image-utils";

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
  birthDate?: string;
  location?: string;
  quote?: string;
  bgGradient?: string;
  aspectRatio?: string;
  authorName?: string;
  sourceName?: string;
  sourceUrl?: string;
  sources?: ContentSource[];
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
  const categoryText = data.category ? data.category.split("•")[0].trim() : undefined;
  const cardImage = data.images && data.images.length > 0 ? getOptimizedImageUrl(data.images[0], { width: 600 }) : null;

  // VARIANT 1: HIGHLIGHT CARD (PURE TYPOGRAPHY LINKED SECTION WITHOUT CARD BOX)
  if (variant === "highlight" || variant === "plain" || variant === "stat") {
    const cardBody = (
      <motion.div
        onClick={onClick}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group cursor-pointer text-right bg-transparent border-none space-y-3 shadow-none overflow-hidden w-full relative flex flex-col justify-between"
      >
        <div className="space-y-2 overflow-hidden text-right">
          {categoryText && (
            <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block">
              {categoryText}
            </span>
          )}
          <h3 className="block font-abyan-title text-xl md:text-2xl text-slate-900 font-normal leading-snug group-hover:text-sky-600 transition-colors">
            {data.title}
          </h3>
          {(data.description || data.subtitle) && (
            <p className="text-sm md:text-base leading-relaxed text-[#1e293b] font-abyan-body font-normal block">
              {data.description || data.subtitle}
            </p>
          )}
        </div>

        {data.linkText && (
          <div className="pt-2 text-right">
            <span className="text-sm md:text-base leading-relaxed text-sky-600 font-abyan-title font-normal group-hover:translate-x-[-4px] transition-transform inline-block">
              {data.linkText}
            </span>
          </div>
        )}
      </motion.div>
    );

    if (data.href) {
      return (
        <Link href={data.href} className="no-underline block w-full h-full">
          {cardBody}
        </Link>
      );
    }

    return cardBody;
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
          {cardImage ? (
            <Image
              src={cardImage}
              alt={data.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null}
        </div>

        {/* Title & Details Below Photo Box */}
        <div className="space-y-1.5 overflow-hidden">
          {categoryText && (
            <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
              {categoryText}
            </span>
          )}
          <h3 className="font-abyan-title text-base md:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
            {data.title}
          </h3>
          {data.location && (
            <span className="text-xs sm:text-sm font-normal text-sky-700 font-abyan-title block break-words leading-snug">
              {data.location}
            </span>
          )}
        </div>

        {/* Footer Prompt */}
        <div className="pt-1 text-left text-sm text-sky-600 font-abyan-title border-none">
          <span className="group-hover:translate-x-[-3px] transition-transform font-normal inline-block">
            معاينة ←
          </span>
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
            {cardImage ? (
              <Image
                src={cardImage}
                alt={data.title}
                fill
                sizes="(max-width: 640px) 96px, 144px"
                className="object-cover transition-transform duration-500 pointer-events-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : null}
          </div>

          {/* Title, Role & Button Side Container */}
          <div className="flex flex-col justify-between flex-1 py-1 overflow-hidden">
            <div className="space-y-1.5 overflow-hidden">
              {categoryText && (
                <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
                  {categoryText}
                </span>
              )}
              <h3 className="font-abyan-title text-base md:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
                {data.title}
              </h3>
              {data.subtitle && (
                <span className="text-xs sm:text-sm font-normal text-slate-700 font-abyan-body block break-words leading-snug">
                  {data.subtitle}
                </span>
              )}
              {/* Location strictly on its own vertical line */}
              {data.location && (
                <span className="text-xs sm:text-sm font-normal text-sky-600 font-abyan-title block break-words leading-snug mt-1">
                  {data.location}
                </span>
              )}
            </div>

            {/* Footer Prompt */}
            <div className="flex justify-end items-center text-sm text-sky-600 font-abyan-title overflow-hidden border-none mt-auto">
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
        {categoryText && (
          <span className="text-xs md:text-sm font-normal text-[#10b981] font-abyan-title block">
            {categoryText}
          </span>
        )}
        <h3 className="font-abyan-title text-base md:text-lg text-slate-900 font-normal group-hover:text-sky-600 transition-colors leading-snug">
          {data.title}
        </h3>
      </div>

      {data.linkText && (
        <div className="pt-2">
          <span className="text-sm md:text-base leading-relaxed text-sky-600 font-abyan-title font-normal group-hover:translate-x-[-4px] transition-transform inline-block">
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
