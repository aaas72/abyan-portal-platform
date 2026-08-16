"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, EmptyState } from "@/components/ui";
import { HistoryEra } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";
import { updateUrlParams } from "@/lib/url-sync";

interface HistoryClientProps {
  historyEras: HistoryEra[];
}

export default function HistoryClient({ historyEras }: HistoryClientProps) {
  const searchParams = useSearchParams();

  const [selectedEraId, setSelectedEraId] = useState<string>(() => {
    const eraParam = searchParams.get("era") || searchParams.get("id");
    if (eraParam) {
      const match = historyEras.find(
        (e) => e.id === eraParam || e.eraTitle === eraParam
      );
      if (match) return match.id;
    }
    return historyEras[0]?.id || "ancient";
  });

  useEffect(() => {
    const eraParam = searchParams.get("era") || searchParams.get("id");
    if (eraParam) {
      const match = historyEras.find(
        (e) => e.id === eraParam || e.eraTitle === eraParam
      );
      if (match) {
        setSelectedEraId(match.id);
      }
    }
  }, [searchParams, historyEras]);

  const handleSelectEra = (eraId: string) => {
    setSelectedEraId(eraId);
    updateUrlParams({ era: eraId });
  };

  const activeEra =
    historyEras.find((e) => e.id === selectedEraId) || historyEras[0];

  if (!historyEras || historyEras.length === 0 || !activeEra) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز القسم التاريخي"
        message="لم يتم إضافة بيانات الحقب التاريخية حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="العمق التاريخي والحضاري"
        titlePrefix="التاريخ والحضارات في"
        titleHighlight="أبين"
        description="استعراض موسوعي شامل للحقب التاريخية، الممالك اليمنية القديمة، العصر الإسلامي، عصر السلطنات، والنهضة الحديثة"
      />

      {/* MAIN HISTORY TIMELINE SELECTOR & ERA SHOWCASE */}
      <SmartContainer>

        {/* MOBILE VIEW: ACCORDION LIST (Visible on Mobile & Tablet Portrait < lg) */}
        <div className="block lg:hidden space-y-4">
          <span className="text-sm sm:text-base font-normal text-slate-900 font-abyan-title block text-right mb-3">
            انقر على الحقبة للاستعراض والتوسيع المفصل:
          </span>

          <div className="space-y-3">
            {historyEras.map((era) => {
              const isSelected = selectedEraId === era.id;

              return (
                <div
                  key={era.id}
                  className="border-b border-slate-100 pb-4 text-right transition-colors"
                >
                  {/* Era Card Header */}
                  <div
                    onClick={() => handleSelectEra(isSelected ? "" : era.id)}
                    className="cursor-pointer py-2.5 flex items-center justify-between"
                  >
                    <div className="space-y-1 text-right flex-1 pl-3">
                      <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block">
                        {era.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{era.endYear}
                      </span>
                      <h3
                        className={`font-abyan-title text-lg sm:text-xl font-normal transition-colors duration-300 ${
                          isSelected
                            ? "text-sky-600 font-medium"
                            : "text-slate-900 hover:text-sky-600"
                        }`}
                      >
                        {era.eraTitle}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 font-abyan-body font-normal">
                        {era.shortSummary}
                      </p>
                    </div>

                    <span className="text-sm font-abyan-title text-sky-600 font-normal shrink-0">
                      {isSelected ? "إغلاق" : "استعراض"}
                    </span>
                  </div>

                  {/* Accordion Expandable Detailed Content */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pt-4 space-y-5"
                      >
                        <div className="space-y-1">
                          <span className="text-sm sm:text-base text-slate-500 font-abyan-title block">
                            {era.historicalCapital}
                          </span>
                        </div>

                        <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
                          {era.fullDescription}
                        </p>

                        <div className="space-y-2 pt-1">
                          <h5 className="text-base sm:text-lg font-normal text-slate-900 font-abyan-title block">
                            أبرز الأحداث والمشاهد التاريخية:
                          </h5>
                          <ul className="space-y-1.5 list-none p-0 m-0">
                            {era.keyEvents.map((evt, idx) => (
                              <li
                                key={idx}
                                className="text-sm sm:text-base text-sky-600 font-abyan-body font-medium leading-relaxed"
                              >
                                • {evt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 pt-1">
                          <h5 className="text-base sm:text-lg font-normal text-slate-900 font-abyan-title block">
                            المعالم والشواهد المرتبطة بالحقبة:
                          </h5>
                          <ul className="space-y-1.5 list-none p-0 m-0">
                            {(era.notableLandmarks || []).map((landmark, idx) => (
                              <li
                                key={idx}
                                className="text-sm sm:text-base text-[#10b981] font-abyan-body font-medium leading-relaxed break-words whitespace-normal"
                              >
                                • {landmark}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP VIEW: 2-COLUMN SIDE-BY-SIDE LAYOUT (Visible on Large Screens >= lg) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start w-full">

          {/* Right Column: Eras Selector List (col-4) */}
          <div className="lg:col-span-4 min-w-0 max-w-sm space-y-3">
            <span className="text-sm sm:text-base font-normal text-slate-900 font-abyan-title block text-right mb-2">
              اختر الحقبة التاريخية للاستعراض المفصل:
            </span>

            <div className="grid grid-cols-1 gap-1 border-r border-slate-100 pr-3">
              {historyEras.map((era) => {
                const isSelected = selectedEraId === era.id;

                return (
                  <div
                    key={era.id}
                    onClick={() => handleSelectEra(era.id)}
                    className="py-3.5 px-1 text-right cursor-pointer bg-transparent border-b border-slate-100 last:border-none shadow-none transition-colors duration-300 min-w-0 w-full overflow-hidden"
                  >
                    <div className="flex flex-col text-right space-y-0.5 min-w-0 w-full">
                      <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title">
                        {era.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{era.endYear}
                      </span>
                      <h3 className={`font-abyan-title text-base sm:text-lg font-normal transition-colors duration-300 break-words whitespace-normal ${
                        isSelected ? "text-sky-600 font-medium" : "text-slate-900 hover:text-sky-600"
                      }`}>
                        {era.eraTitle}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Column: Active Era Detailed Showcase (col-8) */}
          <div className="lg:col-span-8 min-w-0 w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEra.id}
                initial={curtainOverlayVariants.initial}
                animate={curtainOverlayVariants.animate}
                exit={curtainOverlayVariants.exit}
                transition={curtainOverlayTransition}
                className="p-6 sm:p-8 text-right bg-white border-none shadow-none space-y-6 min-w-0 w-full"
              >
                <motion.div {...itemFadeInRight(0.05)} className="space-y-1 min-w-0">
                  <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                    {activeEra.startYear}&nbsp;&nbsp;-&nbsp;&nbsp;{activeEra.endYear}
                  </span>
                  <span className="text-sm sm:text-base text-slate-500 font-abyan-title block break-words whitespace-normal">
                    {activeEra.historicalCapital}
                  </span>
                  {activeEra.authorName && (
                    <span className="text-sm text-[#10b981] font-abyan-body block">
                      تدوين وبحث: {activeEra.authorName}
                    </span>
                  )}
                </motion.div>

                <motion.h2
                  {...itemFadeInRight(0.1)}
                  className="font-abyan-title text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-snug font-normal break-words whitespace-normal"
                >
                  {activeEra.eraTitle}
                </motion.h2>

                {/* Main Highlight Summary */}
                {activeEra.shortSummary && (
                  <motion.p
                    {...itemFadeInRight(0.14)}
                    className="text-sm sm:text-base lg:text-lg text-slate-800 font-abyan-body font-normal leading-relaxed pt-1 break-words whitespace-normal max-w-full"
                  >
                    {activeEra.shortSummary}
                  </motion.p>
                )}

                {/* Extended Narrative Description */}
                <motion.p
                  {...itemFadeInRight(0.18)}
                  className="text-sm sm:text-base lg:text-lg text-slate-700 font-abyan-body font-normal leading-relaxed pt-1 break-words whitespace-normal max-w-full"
                >
                  {activeEra.fullDescription}
                </motion.p>

                <motion.div {...itemFadeInRight(0.22)} className="space-y-2 pt-2 min-w-0">
                  <h5 className="text-base sm:text-lg font-normal text-slate-900 font-abyan-title block">
                    أبرز الأحداث والمشاهد التاريخية:
                  </h5>
                  <ul className="space-y-1.5 list-none p-0 m-0 min-w-0">
                    {activeEra.keyEvents.map((evt, idx) => (
                      <li
                        key={idx}
                        className="text-sm sm:text-base text-sky-600 font-abyan-body font-medium leading-relaxed break-words whitespace-normal"
                      >
                        • {evt}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div {...itemFadeInRight(0.28)} className="space-y-2 pt-2 min-w-0">
                  <h5 className="text-base sm:text-lg font-normal text-slate-900 font-abyan-title block">
                    المعالم والشواهد المرتبطة بالحقبة:
                  </h5>
                  <ul className="space-y-1.5 list-none p-0 m-0 min-w-0">
                    {(activeEra.notableLandmarks || []).map((landmark, idx) => (
                      <li
                        key={idx}
                        className="text-sm sm:text-base text-[#10b981] font-abyan-body font-medium leading-relaxed break-words whitespace-normal"
                      >
                        • {landmark}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </SmartContainer>
    </>
  );
}
