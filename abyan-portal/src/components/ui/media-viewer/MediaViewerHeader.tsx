"use client";

import React from "react";
import Image from "next/image";
import { MediaItem } from "@/types/schemas";
import { formatFormalArabicDate, formatFormalArabicPeriod } from "@/lib/utils";
import { getCareerPeriodLabel } from "./media-viewer-utils";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface MediaViewerHeaderProps {
  item: MediaItem;
  allImages: string[];
  onExpandImage: (index: number) => void;
}

export default function MediaViewerHeader({
  item,
  allImages,
  onExpandImage,
}: MediaViewerHeaderProps) {
  const displayImage = allImages.length > 0 ? getOptimizedImageUrl(allImages[0], { width: 800 }) : null;

  return (
    <div className="flex items-center gap-4 sm:gap-6 p-5 sm:p-7 bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 border-b border-emerald-100/40 shrink-0 relative">
      {/* Square Image Box (Right side in RTL) */}
      <div
        className={`w-32 h-32 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 bg-white cursor-zoom-in ${
          !allImages.length ? (item.bgGradient || "from-emerald-900 via-sky-900 to-slate-900") : ""
        }`}
        onClick={() => {
          if (allImages.length > 0) onExpandImage(0);
        }}
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 128px, 176px"
            className="object-cover hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Information (Left side of the image in RTL) */}
      <div className="flex-1 flex flex-col justify-center space-y-1.5 pr-1 sm:pr-2 min-h-0">
        {item.categoryLabel && (
          <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block leading-none">
            {item.categoryLabel}
          </span>
        )}
        <h2 className="font-abyan-title text-xl sm:text-2xl lg:text-3xl text-slate-900 font-normal leading-snug break-words">
          {item.title}
        </h2>
        
        {item.subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-normal">
            {item.subtitle}
          </p>
        )}

        {/* 2-Column Meta Grid (Keeps header balanced with image height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
          {/* 1. Right Col Row 1: Location */}
          {item.location && (!item.subtitle || !item.subtitle.includes(item.location)) && (
            <span className="text-sky-600 font-abyan-title block truncate">
              {item.location}
            </span>
          )}

          {/* 2. Left Col Row 1: Birth Date */}
          {item.birthDate && (
            <span className="text-slate-800 font-abyan-title block truncate">
              الميلاد: {formatFormalArabicDate(item.birthDate)}
            </span>
          )}

          {/* 3. Right Col Row 2: Author / Documentation */}
          {item.authorName && (
            <span className="text-[#10b981] font-abyan-title block truncate">
              تدوين: {item.authorName}
            </span>
          )}

          {/* 4. Left Col Row 2: Career / Term Path */}
          {(item.startYear || item.endYear) ? (
            <span className="text-slate-800 font-abyan-title block truncate">
              {item.startYear && item.endYear ? (
                <>{getCareerPeriodLabel(item)}: {formatFormalArabicPeriod(item.startYear, item.endYear)}</>
              ) : item.startYear ? (
                <>بداية {getCareerPeriodLabel(item)}: {formatFormalArabicDate(item.startYear)}</>
              ) : (
                <>نهاية {getCareerPeriodLabel(item)}: {formatFormalArabicDate(item.endYear)}</>
              )}
            </span>
          ) : item.year ? (
            <span className="text-slate-800 font-abyan-title block truncate">
              {formatFormalArabicDate(item.year)}
            </span>
          ) : null}

          {/* 5. Left Col Row 3: Death Date (if present) */}
          {item.deathDate && (
            <span className="text-slate-800 font-abyan-title block truncate sm:col-start-2">
              الوفاة: {formatFormalArabicDate(item.deathDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
