"use client";

import React from "react";
import { motion } from "framer-motion";
import SmartContainer from "@/components/layout/SmartContainer";
import { sectionFadeUpVariants } from "@/lib/animations";

interface SubpageHeroProps {
  tag: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  description: string;
}

export default function SubpageHero({
  tag,
  titlePrefix,
  titleHighlight,
  titleSuffix = "",
  description,
}: SubpageHeroProps) {
  return (
    <SmartContainer className="mb-12 text-center">
      <motion.div {...sectionFadeUpVariants} className="space-y-3">
        <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
          {tag}
        </span>
        <h1 className="font-abyan-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-normal font-normal">
          {titlePrefix} <span className="text-sky-600">{titleHighlight}</span> {titleSuffix}
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-slate-700 max-w-2xl mx-auto font-abyan-body font-normal">
          {description}
        </p>
      </motion.div>
    </SmartContainer>
  );
}
