"use client";

import React, { useState, useMemo } from "react";
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

interface PioneersClientProps {
  initialData: PioneerCategory[];
}

export default function PioneersClient({ initialData }: PioneersClientProps) {
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

  const handleOpenPioneerModal = (fig: PioneerFigure) => {
    setSelectedPioneerModal({
      id: fig.id,
      title: fig.name,
      subtitle: fig.role,
      authorName: fig.authorName,
      fullBiography: `${fig.biography}${fig.quote ? `\n\nالمقولة والشاهد التراثي: « ${fig.quote} »` : ""}`,
      year: `${fig.startYear || ""}\u00A0\u00A0-\u00A0\u00A0${fig.endYear || ""}`,
      location: fig.location,
      categoryLabel: currentCategory.title,
      description: fig.role,
      bgGradient: fig.bgGradient,
      images: fig.images,
    });
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
        onSelectTab={setActiveTabId}
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
        onClose={() => setSelectedPioneerModal(null)}
      />
    </>
  );
}
