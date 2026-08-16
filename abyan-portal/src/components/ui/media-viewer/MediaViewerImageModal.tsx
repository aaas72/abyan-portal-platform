"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toArabicDigits } from "@/lib/utils";

interface MediaViewerImageModalProps {
  title: string;
  allImages: string[];
  expandedImageIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function MediaViewerImageModal({
  title,
  allImages,
  expandedImageIndex,
  onClose,
  onSelectIndex,
}: MediaViewerImageModalProps) {
  return (
    <AnimatePresence>
      {expandedImageIndex !== null && (
        <motion.div
          key="expanded-image-modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 z-50 bg-white overflow-hidden isolate flex flex-col items-center justify-center cursor-pointer"
        >
          {/* Top Fixed Header with Clean Flex Layout */}
          <div 
            className="w-full shrink-0 flex items-center justify-end px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
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
              alt={title}
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
                  onSelectIndex(
                    expandedImageIndex === 0
                      ? allImages.length - 1
                      : expandedImageIndex - 1
                  )
                }
                className="bg-transparent text-slate-900 hover:text-sky-600 border-none cursor-pointer p-2 transition-colors font-abyan-title text-sm sm:text-base"
              >
                السابق
              </button>
            )}
            
            <span className="text-sm font-abyan-title text-slate-500 min-w-[60px] text-center">
              {toArabicDigits(expandedImageIndex + 1)} / {toArabicDigits(allImages.length)}
            </span>

            {allImages.length > 1 && (
              <button
                onClick={() =>
                  onSelectIndex(
                    expandedImageIndex === allImages.length - 1
                      ? 0
                      : expandedImageIndex + 1
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
  );
}
