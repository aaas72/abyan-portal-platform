"use client";

import React from "react";
import Image from "next/image";
import { MediaItem } from "@/types/schemas";
import { toArabicDigits } from "@/lib/utils";
import { getQuoteLabel } from "./media-viewer-utils";

interface MediaViewerBodyProps {
  item: MediaItem;
  allImages: string[];
  expandedImageIndex: number | null;
  onExpandImage: (index: number) => void;
}

export default function MediaViewerBody({
  item,
  allImages,
  expandedImageIndex,
  onExpandImage,
}: MediaViewerBodyProps) {
  return (
    <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-thin-scrollbar my-4">
      <div className="space-y-6">
        {/* Narrative Biography / Description */}
        <div className="space-y-3">
          <h4 className="font-abyan-title text-lg sm:text-xl text-slate-900 font-normal border-none">
            نبذة وتفاصيل:
          </h4>
          <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed whitespace-pre-line text-justify">
            {item.fullBiography || item.description}
          </p>
        </div>

        {/* Key Achievements Section */}
        {item.achievements && item.achievements.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal border-none">
              أبرز الإنجازات والمحطات:
            </h4>
            <ul className="space-y-2.5 list-none pr-0">
              {item.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base font-abyan-body text-slate-700 leading-relaxed">
                  <span className="text-[#10b981] font-abyan-title font-normal shrink-0 select-none text-base">
                    {toArabicDigits(idx + 1)}.
                  </span>
                  <span className="flex-1 text-slate-800">{toArabicDigits(ach)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contextual Quote Section */}
        {item.quote && (
          <div className="space-y-2 pt-2">
            <h4 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal border-none">
              {getQuoteLabel(item)}
            </h4>
            <p className="font-abyan-title text-base sm:text-lg text-sky-600 font-normal leading-relaxed text-right">
              « {toArabicDigits(item.quote.replace(/^[«"'\s]+|[»"'\s]+$/g, ""))} »
            </p>
          </div>
        )}

        {/* Documentary Sources Section */}
        {(() => {
          const sourcesList = item.sources && item.sources.length > 0 
            ? item.sources 
            : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []);
          if (sourcesList.length === 0) return null;
          return (
            <div className="pt-4 space-y-2.5 border-t border-slate-100">
              <h4 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal border-none">
                المصادر والمراجع التوثيقية:
              </h4>
              <ul className="space-y-2 list-none pr-0">
                {sourcesList.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-abyan-body text-slate-700">
                    <span className="text-[#10b981] font-abyan-title font-normal shrink-0 select-none">
                      {toArabicDigits(idx + 1)}.
                    </span>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:text-sky-700 hover:underline font-abyan-title transition-colors inline-flex items-center gap-1"
                      >
                        <span>{src.name}</span>
                        <span className="text-[10px] text-sky-400">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-800">{src.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* Additional Images Section */}
        {allImages.length > 1 && (
          <div className="pt-6 space-y-4 border-t border-slate-100">
            <h4 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal border-none">
              معرض الصور والوثائق:
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-thin-scrollbar no-scrollbar">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => onExpandImage(idx)}
                  className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    expandedImageIndex === idx
                      ? "border-[#10b981] opacity-100 shadow-md"
                      : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${item.title} - ${idx + 1}`}
                    fill
                    className="object-cover pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
