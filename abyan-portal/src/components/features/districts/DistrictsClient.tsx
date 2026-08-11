"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, CategoryTabSelector, TagList, EmptyState } from "@/components/ui";
import UnifiedMediaViewer, {
  MediaItem,
} from "@/components/ui/UnifiedMediaViewer";
import UniversalCard from "@/components/cards/UniversalCard";
import DistrictDesktopSidebar from "./DistrictDesktopSidebar";
import DistrictDesktopTabsContent from "./DistrictDesktopTabsContent";
import DistrictMobileTabsContent from "./DistrictMobileTabsContent";
import DistrictHero from "./DistrictHero";
import { DistrictItem } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";

type DistrictSubTab =
  | "history"
  | "nature"
  | "pioneers"
  | "sites"
  | "economy"
  | "culture"
  | "villages";

interface DistrictsClientProps {
  allDistricts: DistrictItem[];
  regions: { id: string; label: string; description?: string }[];
}



export default function DistrictsClient({
  allDistricts,
  regions,
}: DistrictsClientProps) {
  const searchParams = useSearchParams();
  const queryDistrictId = searchParams.get("id");

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    queryDistrictId || "zinjibar",
  );
  const [selectedRegionFilter, setSelectedRegionFilter] =
    useState<string>("all");
  const [activeSubTab, setActiveSubTab] = useState<DistrictSubTab>("history");
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(
    null,
  );

  useEffect(() => {
    if (queryDistrictId) {
      const requestedDistrict = allDistricts.find(d => d.id === queryDistrictId);
      if (requestedDistrict) {
        setSelectedDistrictId(queryDistrictId);
        setSelectedRegionFilter(requestedDistrict.region);
      } else {
        setSelectedDistrictId(queryDistrictId);
      }
    }
  }, [queryDistrictId, allDistricts]);

  useEffect(() => {
    setActiveSubTab("history");
  }, [selectedDistrictId]);

  const filteredDistricts = React.useMemo(() => {
    return selectedRegionFilter === "all"
      ? allDistricts
      : allDistricts.filter((d) => d.region === selectedRegionFilter);
  }, [allDistricts, selectedRegionFilter]);

  useEffect(() => {
    if (filteredDistricts.length > 0) {
      const currentDistrictExists = filteredDistricts.some((d) => d.id === selectedDistrictId);
      if (!currentDistrictExists) {
        setSelectedDistrictId(filteredDistricts[0].id);
      }
    }
  }, [filteredDistricts, selectedDistrictId]);

  const activeDistrict =
    allDistricts.find((d) => d.id === selectedDistrictId) || allDistricts[0];

  const subTabs: { id: DistrictSubTab; label: string }[] = [
    { id: "history", label: "التاريخ والنشأة" },
    { id: "nature", label: "الجغرافيا والمناخ" },
    { id: "pioneers", label: "الأعلام والشخصيات" },
    { id: "sites", label: "المعالم والأثار" },
    { id: "economy", label: "الاقتصاد والزراعة" },
    { id: "culture", label: "الثقافة والعادات" },
    { id: "villages", label: "القرى والبلدات" },
  ];

  if (!allDistricts || allDistricts.length === 0 || !activeDistrict) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز قسم المديريات"
        message="لم يتم إضافة بيانات المديريات حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="التقسيم الإداري والجغرافي والتاريخي الشامل"
        titlePrefix="دليل وموسوعة مديريات"
        titleHighlight="أبين الـ 11"
        description="مرجع شامل ومفصل للتاريخ العريق، التضاريس والجغرافيا، المعالم الأثرية، الأعلام والشخصيات، والاقتصاد والتراث بكل مديرية"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={regions}
        activeTab={selectedRegionFilter}
        onSelectTab={setSelectedRegionFilter}
      />

      {/* REGION DESCRIPTION */}
      <AnimatePresence mode="wait">
        {(() => {
          const activeRegion = regions.find(r => r.id === selectedRegionFilter);
          if (activeRegion && activeRegion.description) {
            return (
              <motion.div 
                key={selectedRegionFilter}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-4xl mx-auto px-6 lg:px-10 -mt-2 mb-8 text-center"
              >
                <p className="font-abyan-body text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeRegion.description}
                </p>
              </motion.div>
            );
          }
          return null;
        })()}
      </AnimatePresence>

      {/* MAIN DISTRICTS GUIDE GRID & PROFILE SHOWCASE */}
      <SmartContainer>
        {/* MOBILE VIEW */}
        <div className="block lg:hidden space-y-4">
          <span className="text-xs font-normal text-slate-900 font-abyan-title block text-right mb-3">
            انقر على المديرية للاستعراض الموسوعي التفصيلي:
          </span>

          <div className="space-y-3">
            {filteredDistricts.map((dist) => {
              const isSelected = selectedDistrictId === dist.id;

              return (
                <div
                  key={dist.id}
                  className="border-b border-slate-100 pb-4 text-right transition-colors"
                >
                  {/* District Card Header */}
                  <div
                    onClick={() =>
                      setSelectedDistrictId(isSelected ? "" : dist.id)
                    }
                    className="cursor-pointer py-2 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 text-right flex-1 pl-3">
                      <h3
                        className={`font-abyan-title text-base sm:text-lg font-normal leading-snug transition-colors duration-300 ${
                          isSelected
                            ? "text-sky-600 font-medium"
                            : "text-slate-900 hover:text-sky-600"
                        }`}
                      >
                        مديرية {dist.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-abyan-body font-normal">
                        {dist.title}
                      </p>
                    </div>

                    <span className="text-xs font-abyan-title text-sky-600 font-normal shrink-0">
                      {isSelected ? "إغلاق" : "استعراض الموسوعة"}
                    </span>
                  </div>

                  {/* Accordion Expandable Detailed Profile */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pt-4 space-y-5 text-right"
                      >
                        <div className="pt-1 w-full overflow-hidden">
                          <CategoryTabSelector
                            tabs={subTabs}
                            activeTab={activeSubTab}
                            onSelectTab={(tabId) =>
                              setActiveSubTab(tabId as DistrictSubTab)
                            }
                            size="sm"
                            noContainer
                          />
                        </div>

                        <DistrictMobileTabsContent activeSubTab={activeSubTab} dist={dist} setSelectedMediaItem={setSelectedMediaItem} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP VIEW: 2-COLUMN SIDE-BY-SIDE LAYOUT */}
        <div className="hidden lg:flex gap-8 items-start">
          <DistrictDesktopSidebar 
            filteredDistricts={filteredDistricts} 
            selectedDistrictId={selectedDistrictId} 
            setSelectedDistrictId={setSelectedDistrictId} 
          />

          {/* Left Column: Active District Detailed Profile */}
          <div className="flex-1 min-w-0 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDistrict.id}
                initial={curtainOverlayVariants.initial}
                animate={curtainOverlayVariants.animate}
                exit={curtainOverlayVariants.exit}
                transition={curtainOverlayTransition}
                className="p-6 sm:p-8 text-right bg-white border-none shadow-none space-y-6"
              >
                {/* District Hero */}
                <motion.div {...itemFadeInRight(0.05)}>
                  <DistrictHero district={activeDistrict} />
                </motion.div>

                {/* Responsive Scrollable Sub-Tab Selector */}
                <motion.div
                  {...itemFadeInRight(0.14)}
                  className="pt-1 w-full overflow-hidden"
                >
                  <CategoryTabSelector
                    tabs={subTabs}
                    activeTab={activeSubTab}
                    onSelectTab={(tabId) =>
                      setActiveSubTab(tabId as DistrictSubTab)
                    }
                    size="sm"
                    noContainer
                  />
                </motion.div>

                {/* Dynamic Sub-Tab Content Section */}
                <AnimatePresence mode="wait">
                  <DistrictDesktopTabsContent
                    activeSubTab={activeSubTab}
                    activeDistrict={activeDistrict}
                    setSelectedMediaItem={setSelectedMediaItem}
                  />
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SmartContainer>

      {/* Unified Media Viewer Modal Preview */}
      <UnifiedMediaViewer
        item={selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
      />
    </>
  );
}
