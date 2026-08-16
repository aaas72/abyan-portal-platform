"use client";

import React from "react";
import { MediaItem } from "@/types/schemas";

interface MediaViewerFooterProps {
  item: MediaItem;
  onClose: () => void;
}

export default function MediaViewerFooter({
  item,
  onClose,
}: MediaViewerFooterProps) {
  const sourcesList = item.sources && item.sources.length > 0 
    ? item.sources 
    : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []);

  return (
    <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 mt-auto flex flex-wrap items-center justify-between gap-2 shrink-0">
      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 font-abyan-body font-normal">
        <span>
          محفوظ في الأرشيف الرقمي لبوابة أبين الثقافية
        </span>
        {item.authorName && (
          <>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              إعداد وتوثيق: {item.authorName}
            </span>
          </>
        )}
        {sourcesList.length > 0 && (
          <>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              المصادر:{" "}
              {sourcesList.map((src, i) => (
                <span key={i}>
                  {i > 0 && "، "}
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-700 underline font-abyan-title"
                    >
                      {src.name}
                    </a>
                  ) : (
                    <span>{src.name}</span>
                  )}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 bg-transparent hover:text-[#10b981] text-slate-700 text-xs font-abyan-title transition-colors border-none cursor-pointer"
      >
        إغلاق المعاينة
      </button>
    </div>
  );
}
