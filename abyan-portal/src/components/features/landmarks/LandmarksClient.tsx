"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, CategoryTabSelector, UnifiedMediaViewer, MediaItem, EmptyState } from "@/components/ui";
import { ImageShowcaseCard, ImageShowcaseData } from "@/components/cards";
import { LandmarkCategory } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";

interface LandmarksClientProps {
  initialData: LandmarkCategory[];
}

export default function LandmarksClient({ initialData }: LandmarksClientProps) {
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const valid = initialData.find((c) => (c.photoCards && c.photoCards.length > 0) || (c.keyLandmarks && c.keyLandmarks.length > 0));
    return valid ? valid.id : "delta";
  });
  const [selectedMediaModal, setSelectedMediaModal] = useState<MediaItem | null>(null);

  const categoryTabs = useMemo(() => {
    return initialData
      .filter((c) => (c.photoCards && c.photoCards.length > 0) || (c.keyLandmarks && c.keyLandmarks.length > 0))
      .map((cat) => ({
        id: cat.id,
        label: cat.categoryName,
      }));
  }, [initialData]);

  const currentCategory = useMemo(() => {
    const validData = initialData.filter((c) => (c.photoCards && c.photoCards.length > 0) || (c.keyLandmarks && c.keyLandmarks.length > 0));
    return validData.find((cat) => cat.id === activeTabId) || validData[0];
  }, [initialData, activeTabId]);

  const handleOpenLandmarkModal = (photoCard: ImageShowcaseData) => {
    setSelectedMediaModal({
      id: photoCard.id,
      title: photoCard.title,
      subtitle: photoCard.tag,
      fullBiography: photoCard.description,
      location: photoCard.location,
      startYear: photoCard.startYear,
      endYear: photoCard.endYear,
      categoryLabel: currentCategory.categoryName,
      description: photoCard.description,
      bgGradient: photoCard.bgGradient,
      images: photoCard.images,
    });
  };

  if (!initialData || initialData.length === 0 || !currentCategory) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز قسم المعالم"
        message="لم يتم إضافة بيانات المعالم السياحية والأثرية حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="التضاريس، المعالم، والدلتا الخضراء"
        titlePrefix="معالم وأطواد"
        titleHighlight="أبين التاريخية"
        description="استكشاف دقيق لصرح سد باتيس، دلتا بنا الخصيبة، حصن القارة المنيع، عقبة ثرة الشامخة، وسواحل شقرة وأحور العريضة"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={categoryTabs}
        activeTab={activeTabId}
        onSelectTab={setActiveTabId}
      />

      {/* MAIN LANDMARK SHOWCASE PANEL */}
      <SmartContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={curtainOverlayVariants.initial}
            animate={curtainOverlayVariants.animate}
            exit={curtainOverlayVariants.exit}
            transition={curtainOverlayTransition}
            className="py-2 sm:py-6 text-right space-y-6 max-w-4xl mx-auto"
          >
            {/* Category Subtitle & Header */}
            <motion.div {...itemFadeInRight(0.05)} className="space-y-1">
              <span className="text-xs sm:text-sm font-normal text-[#10b981] font-abyan-title block">
                {currentCategory.categoryName}
              </span>
              <span className="text-xs text-slate-500 font-abyan-title block">
                {currentCategory.subtitle}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              {...itemFadeInRight(0.1)}
              className="font-abyan-title text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-snug font-normal"
            >
              {currentCategory.title}
            </motion.h2>

            {/* Description Paragraph */}
            <motion.p
              {...itemFadeInRight(0.16)}
              className="text-xs sm:text-sm lg:text-base text-slate-700 font-abyan-title font-normal leading-relaxed pt-1"
            >
              {currentCategory.description}
            </motion.p>

            {/* VISUAL LANDMARK CARDS GRID USING DEDICATED IMAGE SHOWCASE CARD */}
            {currentCategory.photoCards && (
              <motion.div {...itemFadeInRight(0.2)} className="pt-2 space-y-4">
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
                  معرض مشاهد ومعالم {currentCategory.categoryName}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {currentCategory.photoCards.map((photoCard) => (
                    <ImageShowcaseCard
                      key={photoCard.id}
                      item={photoCard}
                      onClick={() => handleOpenLandmarkModal(photoCard)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Key Landmarks List */}
            <motion.div {...itemFadeInRight(0.24)} className="space-y-2 pt-2">
              <span className="text-xs font-normal text-slate-900 font-abyan-title block">
                أبرز الشواهد والمعالم الجغرافية:
              </span>
              <ul className="space-y-1.5 list-none p-0 m-0">
                {currentCategory.keyLandmarks.map((lm, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-sky-600 font-abyan-title font-normal leading-relaxed"
                  >
                    • {lm}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Unique Features */}
            <motion.div {...itemFadeInRight(0.28)} className="space-y-1 pt-2">
              <span className="text-xs font-normal text-slate-900 font-abyan-title block">
                الأهمية والقيمة التاريخية والطبيعية:
              </span>
              <p className="text-xs sm:text-sm text-[#10b981] font-abyan-title font-normal leading-relaxed">
                {currentCategory.details.join(" • ")}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </SmartContainer>

      {/* UNIFIED MEDIA VIEWER MODAL FOR LANDMARK FULL PHOTO */}
      <UnifiedMediaViewer
        item={selectedMediaModal}
        onClose={() => setSelectedMediaModal(null)}
      />
    </>
  );
}
