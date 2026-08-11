"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import EraDetailOverlay from "@/components/landing/EraDetailOverlay";
import { sectionFadeUpVariants, subtleMicroHover } from "@/lib/animations";
import { HistoryEra } from "@/types/schemas";
import { AdminLandingSection } from "@/types/admin.types";

export default function TimelineSection({ eras = [], sectionData }: { eras?: HistoryEra[], sectionData?: AdminLandingSection }) {
  const [activeEraIndex, setActiveEraIndex] = useState<number | null>(null);

  if (!eras || eras.length === 0) {
    return null;
  }

  const isSelected = activeEraIndex !== null;
  const currentSelectedEra =
    activeEraIndex !== null ? eras[activeEraIndex] : null;

  const title = sectionData?.title || "محطات في تاريخ أبين الخالد";
  const subtitle = sectionData?.subtitle || "انقر على الحقب التاريخية لاستكشاف المعالم والأحداث الوطنية";

  // النقر على مكان فارغ لإغلاق مكون المحتوى السحابي
  const handleBackgroundClick = () => {
    if (isSelected) {
      setActiveEraIndex(null);
    }
  };

  return (
    <section
      id="timeline"
      onClick={handleBackgroundClick}
      className="w-full bg-white border-none shadow-none relative overflow-hidden flex flex-col justify-center items-center cursor-pointer py-16 sm:py-24 lg:py-28 selection:bg-emerald-500 selection:text-white"
    >
      {/* SECTION HEADER */}
      <SmartContainer className="mb-10 lg:mb-14 z-10 w-full">
        <motion.div
          {...sectionFadeUpVariants}
          className="text-center space-y-2 pointer-events-auto"
        >
          <h2 className="font-abyan-title text-2xl md:text-3xl lg:text-4xl text-slate-900 leading-normal font-normal">
            {title}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-600 max-w-xl mx-auto font-abyan-body font-normal">
            {subtitle}
          </p>
        </motion.div>
      </SmartContainer>

      {/* FULL WIDTH HORIZONTAL TIMELINE AXIS */}
      <div className="w-full relative z-20 py-6 pointer-events-auto">
        {/* Dynamic Layered Content Showcase */}
        <EraDetailOverlay era={currentSelectedEra} isSelected={isSelected} />

        <SmartContainer className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="relative w-max mx-auto flex items-center gap-16 sm:gap-24 lg:gap-32 min-h-[140px] px-8 sm:px-16">
            {/* Green Axis Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#10b981] z-0" />

            {/* Timeline Nodes */}
            {eras.map((era, index) => {
              const isActive = activeEraIndex === index;

              return (
                <motion.div
                  key={era.id}
                  {...subtleMicroHover}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEraIndex(isActive ? null : index);
                  }}
                  className="relative z-10 flex flex-col items-center justify-between cursor-pointer group px-2 sm:px-4 h-[140px]"
                >
                  {/* Top: Era Name */}
                  <div className="flex-1 flex flex-col justify-end pb-3">
                    <span
                      className={`font-abyan-title text-sm md:text-base lg:text-lg font-normal transition-colors duration-300 text-center whitespace-nowrap ${
                        isActive
                          ? "text-sky-600 font-medium"
                          : "text-slate-800 group-hover:text-sky-600"
                      }`}
                    >
                      {era.eraTitle}
                    </span>
                  </div>

                  {/* Middle: Interactive Node Dot */}
                  <div className="flex-none flex items-center justify-center">
                    <div
                      className={`w-5 h-5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#10b981] border-2 border-white scale-125 ring-4 ring-[#10b981]/25"
                          : "bg-white border-[3px] border-[#10b981] group-hover:scale-110"
                      }`}
                    />
                  </div>

                  {/* Bottom: Period Tag */}
                  <div className="flex-1 flex flex-col justify-start pt-3">
                    <span className="font-abyan-title text-xs md:text-sm text-slate-500 font-normal whitespace-nowrap text-center">
                      {era.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{era.endYear}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SmartContainer>
      </div>
    </section>
  );
}
