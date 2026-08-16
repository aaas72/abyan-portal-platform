"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
} from "@/lib/animations";
import Image from "next/image";

import { MediaItem } from "@/types/schemas";
export type { MediaItem };

interface UnifiedMediaViewerProps {
  item: MediaItem | null;
  onClose: () => void;
}

export default function UnifiedMediaViewer({
  item,
  onClose,
}: UnifiedMediaViewerProps) {
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!item) {
      setExpandedImageIndex(null);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  if (!item) return null;

  // Use the images array directly
  const allImages = [...(item.images || [])].filter(Boolean) as string[];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={curtainOverlayVariants.initial}
          animate={curtainOverlayVariants.animate}
          exit={curtainOverlayVariants.exit}
          transition={curtainOverlayTransition}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header Section */}
          <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-8 bg-slate-50 border-b border-slate-100 shrink-0 relative">
            {/* Square Image Box (Right side in RTL) */}
            <div
              className={`w-28 sm:w-40 shrink-0 aspect-square rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 bg-white cursor-zoom-in ${
                !allImages.length ? (item.bgGradient || "from-emerald-900 via-sky-900 to-slate-900") : ""
              }`}
              onClick={() => {
                if (allImages.length > 0) setExpandedImageIndex(0);
              }}
            >
              {allImages.length > 0 ? (
                <Image
                  src={allImages[0]}
                  alt={item.title}
                  fill
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
            <div className="flex-1 space-y-2 mt-1 pr-2">
              {item.categoryLabel && (
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  {item.categoryLabel}
                </span>
              )}
              <h2 className="font-abyan-title text-xl sm:text-2xl lg:text-3xl text-slate-900 font-normal leading-snug break-words">
                {item.title}
              </h2>
              
              {item.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 font-abyan-body font-normal leading-relaxed pt-0.5">
                  {item.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs sm:text-sm font-abyan-body font-normal">
                {item.authorName && (
                  <>
                    <span className="text-[#10b981]">
                      تدوين: {item.authorName}
                    </span>
                    {(item.location || item.startYear || item.endYear || item.year) && (
                      <span className="text-slate-300">•</span>
                    )}
                  </>
                )}
                {item.location && (!item.subtitle || !item.subtitle.includes(item.location)) && (
                  <span className="text-sky-600">
                    {item.location}
                  </span>
                )}
                {item.location && (item.startYear || item.endYear || item.year) && (
                  <span className="text-slate-300">•</span>
                )}
                {(item.startYear || item.endYear || item.year) && (
                  <span className="text-slate-500">
                    {item.startYear || item.endYear ? (item.startYear || "") + " - " + (item.endYear || "") : item.year}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Scrollable Body Narrative Section */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-thin-scrollbar my-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-abyan-title text-lg sm:text-xl text-slate-900 font-normal border-none">
                  نبذة وتفاصيل:
                </h4>
                <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed whitespace-pre-line text-justify">
                  {item.fullBiography || item.description}
                </p>
              </div>

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
                        onClick={() => setExpandedImageIndex(idx)}
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
          
          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 mt-auto flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 font-abyan-body font-normal">
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
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-transparent hover:text-[#10b981] text-slate-700 text-xs font-abyan-title transition-colors border-none cursor-pointer"
            >
              إغلاق المعاينة
            </button>
          </div>

        {/* Expanded Full-Modal Image Viewer Overlay */}
        <AnimatePresence>
          {expandedImageIndex !== null && (
            <motion.div
              key="expanded-image-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandedImageIndex(null)}
              className="absolute inset-0 z-50 bg-white overflow-hidden isolate flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Top Fixed Header with Clean Flex Layout */}
              <div 
                className="w-full shrink-0 flex items-center justify-end px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setExpandedImageIndex(null)}
                  className="p-2 -m-2 bg-transparent text-slate-900 hover:text-sky-600 border-none cursor-pointer transition-colors font-abyan-title text-sm sm:text-base flex items-center gap-2"
                >
                  رجوع
                </button>
              </div>

              {/* Image in the Middle */}
              <div
                className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-slate-100 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={allImages[expandedImageIndex]}
                  alt={item.title}
                  fill
                  className="object-contain pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Bottom Fixed Footer with Clean Flex Layout */}
              <div 
                className="w-full shrink-0 flex items-center justify-center gap-6 px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {allImages.length > 1 && (
                  <button
                    onClick={() =>
                      setExpandedImageIndex((prev) =>
                        prev !== null
                          ? prev === 0
                            ? allImages.length - 1
                            : prev - 1
                          : 0
                      )
                    }
                    className="bg-transparent text-slate-900 hover:text-sky-600 border-none cursor-pointer p-2 transition-colors font-abyan-title text-sm sm:text-base"
                  >
                    السابق
                  </button>
                )}
                
                <span className="text-sm font-abyan-title text-slate-500 min-w-[60px] text-center">
                  {expandedImageIndex + 1} / {allImages.length}
                </span>

                {allImages.length > 1 && (
                  <button
                    onClick={() =>
                      setExpandedImageIndex((prev) =>
                        prev !== null
                          ? prev === allImages.length - 1
                            ? 0
                            : prev + 1
                          : 0
                      )
                    }
                    className="bg-transparent text-slate-900 hover:text-sky-600 border-none cursor-pointer p-2 transition-colors font-abyan-title text-sm sm:text-base"
                  >
                    التالي
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
    </>
  );
}
