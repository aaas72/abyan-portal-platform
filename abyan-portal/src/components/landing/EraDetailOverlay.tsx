"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";

import { HistoryEra } from "@/types/schemas";

interface EraDetailOverlayProps {
  era: HistoryEra | null;
  isSelected: boolean;
  onClose?: () => void;
}

export default function EraDetailOverlay({
  era,
  isSelected,
}: EraDetailOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isSelected && era && (
        <motion.div
          key={era.id}
          initial={curtainOverlayVariants.initial}
          animate={curtainOverlayVariants.animate}
          exit={curtainOverlayVariants.exit}
          transition={curtainOverlayTransition}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-[90vw] sm:w-[80vw] lg:w-[60vw] max-w-2xl lg:max-w-3xl pointer-events-none overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="py-6 sm:py-8 pr-6 sm:pr-10 lg:pr-14 pl-6 sm:pl-10 text-right space-y-2.5 rounded-l-3xl bg-gradient-to-r from-transparent via-white/95 via-35% to-white shadow-none border-none backdrop-blur-none pointer-events-auto cursor-default break-words"
          >
            {/* Era Period Tag */}
            <motion.span
              {...itemFadeInRight(0.05)}
              className="text-xs sm:text-sm font-normal text-sky-600 font-abyan-title block"
            >
              {era.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{era.endYear}
            </motion.span>

            {/* Era Capital Sub-heading */}
            <motion.span
              {...itemFadeInRight(0.08)}
              className="font-abyan-title text-[#10b981] text-lg md:text-xl block font-normal break-words whitespace-normal"
            >
              {era.historicalCapital}
            </motion.span>
            
            {/* Main Era Title */}
            <motion.h3
              {...itemFadeInRight(0.12)}
              className="font-abyan-title text-xl md:text-2xl lg:text-3xl text-slate-900 leading-snug font-normal break-words whitespace-normal"
            >
              {era.eraTitle}
            </motion.h3>

            {/* Description */}
            <motion.p
              {...itemFadeInRight(0.16)}
              className="text-sm md:text-base leading-relaxed text-slate-700 font-abyan-body font-normal pt-0.5 max-w-xl break-words"
            >
              {era.shortSummary}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
