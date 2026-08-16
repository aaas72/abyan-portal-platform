"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
} from "@/lib/animations";
import { MediaItem } from "@/types/schemas";

import MediaViewerHeader from "./media-viewer/MediaViewerHeader";
import MediaViewerBody from "./media-viewer/MediaViewerBody";
import MediaViewerFooter from "./media-viewer/MediaViewerFooter";
import MediaViewerImageModal from "./media-viewer/MediaViewerImageModal";

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
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setExpandedImageIndex(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  if (!item) return null;

  const allImages = item.images && item.images.length > 0 ? item.images : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={curtainOverlayVariants.initial}
          animate={curtainOverlayVariants.animate}
          exit={curtainOverlayVariants.exit}
          transition={curtainOverlayTransition}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Top Header with Image and Metadata */}
          <MediaViewerHeader
            item={item}
            allImages={allImages}
            onExpandImage={(idx) => setExpandedImageIndex(idx)}
          />

          {/* Scrollable Narrative Body (Biography, Achievements, Quote, Sources, Thumbnails) */}
          <MediaViewerBody
            item={item}
            allImages={allImages}
            expandedImageIndex={expandedImageIndex}
            onExpandImage={(idx) => setExpandedImageIndex(idx)}
          />

          {/* Bottom Footer Bar */}
          <MediaViewerFooter item={item} onClose={onClose} />

          {/* Fullscreen Expanded Image Modal */}
          <MediaViewerImageModal
            title={item.title}
            allImages={allImages}
            expandedImageIndex={expandedImageIndex}
            onClose={() => setExpandedImageIndex(null)}
            onSelectIndex={(idx) => setExpandedImageIndex(idx)}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
