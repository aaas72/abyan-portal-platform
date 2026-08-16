"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import {
  SubpageHero,
  CategoryTabSelector,
  UnifiedMediaViewer,
  MediaItem,
  EmptyState,
} from "@/components/ui";
import { UniversalCard } from "@/components/cards";
import { PioneerCategory, PioneerFigure } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
} from "@/lib/animations";
import { updateUrlParams } from "@/lib/url-sync";

interface PioneersClientProps {
  initialData: PioneerCategory[];
}

export default function PioneersClient({ initialData }: PioneersClientProps) {
  const searchParams = useSearchParams();

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const valid = initialData.find((c) => c.figures && c.figures.length > 0);
    return valid ? valid.id : "poets";
  });
  const [selectedPioneerModal, setSelectedPioneerModal] =
    useState<MediaItem | null>(null);

  const categoryTabs = useMemo(() => {
    return initialData
      .filter((c) => c.figures && c.figures.length > 0)
      .map((c) => ({
        id: c.id,
        label: c.title,
      }));
  }, [initialData]);

  const currentCategory = useMemo(() => {
    const validData = initialData.filter((c) => c.figures && c.figures.length > 0);
    return validData.find((p) => p.id === activeTabId) || validData[0];
  }, [initialData, activeTabId]);

  const mapFigureToModal = (fig: PioneerFigure, categoryTitle: string): MediaItem => ({
    id: fig.id,
    title: fig.name,
    subtitle: fig.role,
    authorName: fig.authorName,
    sourceName: fig.sourceName,
    sourceUrl: fig.sourceUrl,
    sources: fig.sources,
    fullBiography: fig.biography,
    quote: fig.quote,
    startYear: fig.startYear,
    endYear: fig.endYear,
    birthDate: fig.birthDate,
    deathDate: fig.deathDate,
    achievements: fig.achievements,
    year: `${fig.startYear || ""}\u00A0\u00A0-\u00A0\u00A0${fig.endYear || ""}`,
    location: fig.location,
    categoryLabel: categoryTitle,
    description: fig.role,
    bgGradient: fig.bgGradient,
    images: fig.images,
  });

  // Sync state from URL query parameters on load
  useEffect(() => {
    const tabParam = searchParams.get("tab") || searchParams.get("category");
    if (tabParam) {
      const matchedCat = initialData.find(
        (c) => c.id === tabParam || c.categoryName === tabParam || c.title === tabParam
      );
      if (matchedCat) {
        setActiveTabId(matchedCat.id);
      }
    }

    const itemParam = searchParams.get("item") || searchParams.get("id");
    if (itemParam) {
      for (const cat of initialData) {
        const foundFig = cat.figures?.find(
          (f) => f.id === itemParam || f.name === itemParam
        );
        if (foundFig) {
          setActiveTabId(cat.id);
          setSelectedPioneerModal(mapFigureToModal(foundFig, cat.title));
          break;
        }
      }
    }
  }, [searchParams, initialData]);

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    updateUrlParams({ tab: tabId, item: null });
  };

  const handleOpenPioneerModal = (fig: PioneerFigure) => {
    setSelectedPioneerModal(mapFigureToModal(fig, currentCategory.title));
    updateUrlParams({ item: fig.id });
  };

  const handleCloseModal = () => {
    setSelectedPioneerModal(null);
    updateUrlParams({ item: null });
  };

  if (!initialData || initialData.length === 0 || !currentCategory) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز قسم الأعلام"
        message="لم يتم إضافة شخصيات تاريخية حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="الأعلام والشخصيات التاريخية"
        titlePrefix="أعلام أبين ورواد"
        titleHighlight="الفكر والتاريخ"
        description="تخليد لسير العلماء، الشعراء، القادة، ورواد التنمية والنهضة الذين صاغوا الوجدان الأبيني والوطني"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={categoryTabs}
        activeTab={activeTabId}
        onSelectTab={handleSelectTab}
      />

      {/* PIONEER PROFILE CARDS SHOWCASE GRID */}
      <SmartContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={curtainOverlayVariants.initial}
            animate={curtainOverlayVariants.animate}
            exit={curtainOverlayVariants.exit}
            transition={curtainOverlayTransition}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Category Header Title */}
            <div className="text-right space-y-1">
              <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                الأعلام والرواد
              </span>
              <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                {currentCategory.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-abyan-body font-normal">
                {currentCategory.subtitle}
              </p>
            </div>

            {/* REUSABLE PIONEER CARDS GRID USING UNIVERSAL CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentCategory.figures.map((fig) => (
                <UniversalCard
                  key={fig.id}
                  variant="pioneer"
                  data={{
                    id: fig.id,
                    title: fig.name,
                    category: currentCategory.title,
                    subtitle: fig.role,
                    startYear: fig.startYear,
                    endYear: fig.endYear,
                    birthDate: fig.birthDate,
                    location: fig.location,
                    description: fig.biography,
                    quote: fig.quote,
                    bgGradient: fig.bgGradient,
                    images: fig.images,
                    linkText: "معاينة ←",
                  }}
                  onClick={() => handleOpenPioneerModal(fig)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </SmartContainer>

      {/* UNIFIED MEDIA VIEWER MODAL FOR PIONEER FULL PROFILE */}
      <UnifiedMediaViewer
        item={selectedPioneerModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
