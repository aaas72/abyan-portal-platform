"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, CategoryTabSelector, UnifiedMediaViewer, MediaItem, EmptyState } from "@/components/ui";
import FoodCard from "@/components/cards/FoodCard";
import { EconomyPillar } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";
import { updateUrlParams } from "@/lib/url-sync";

interface EconomyClientProps {
  initialPillars: EconomyPillar[];
}

export default function EconomyClient({ initialPillars }: EconomyClientProps) {
  const searchParams = useSearchParams();

  const [activeEconomyTab, setActiveEconomyTab] = useState<string>(() => {
    const valid = initialPillars.find((p) => (p.photoCards && p.photoCards.length > 0) || (p.keyProducts && p.keyProducts.length > 0) || (p.details && p.details.length > 0));
    return valid ? valid.id : "cotton";
  });
  const [selectedEconomyModal, setSelectedEconomyModal] = useState<MediaItem | null>(null);

  const pillarTabs = useMemo(() => {
    return initialPillars
      .filter((p) => (p.photoCards && p.photoCards.length > 0) || (p.keyProducts && p.keyProducts.length > 0) || (p.details && p.details.length > 0))
      .map((p) => ({
        id: p.id,
        label: p.pillarName,
      }));
  }, [initialPillars]);

  const currentPillar = useMemo(() => {
    const validData = initialPillars.filter((p) => (p.photoCards && p.photoCards.length > 0) || (p.keyProducts && p.keyProducts.length > 0) || (p.details && p.details.length > 0));
    return validData.find((p) => p.id === activeEconomyTab) || validData[0];
  }, [initialPillars, activeEconomyTab]);

  const mapPhotoCardToModal = (photoCard: any, pillarName: string): MediaItem => ({
    id: photoCard.id,
    title: photoCard.title,
    subtitle: photoCard.tag,
    authorName: photoCard.authorName,
    sourceName: photoCard.sourceName,
    sourceUrl: photoCard.sourceUrl,
    sources: photoCard.sources,
    fullBiography: photoCard.description,
    location: photoCard.location,
    categoryLabel: pillarName,
    description: photoCard.description,
    bgGradient: photoCard.bgGradient,
    images: photoCard.images,
  });

  // Sync state from URL query parameters on load
  useEffect(() => {
    const tabParam = searchParams.get("tab") || searchParams.get("pillar") || searchParams.get("category");
    if (tabParam) {
      const matchedPillar = initialPillars.find(
        (p) => p.id === tabParam || p.pillarName === tabParam || p.title === tabParam
      );
      if (matchedPillar) {
        setActiveEconomyTab(matchedPillar.id);
      }
    }

    const itemParam = searchParams.get("item") || searchParams.get("id");
    if (itemParam) {
      for (const pillar of initialPillars) {
        const foundCard = pillar.photoCards?.find(
          (c) => c.id === itemParam || c.title === itemParam
        );
        if (foundCard) {
          setActiveEconomyTab(pillar.id);
          setSelectedEconomyModal(mapPhotoCardToModal(foundCard, pillar.pillarName));
          break;
        }
      }
    }
  }, [searchParams, initialPillars]);

  const handleSelectTab = (tabId: string) => {
    setActiveEconomyTab(tabId);
    updateUrlParams({ tab: tabId, item: null });
  };

  const handleOpenPhotoModal = (photoCard: any) => {
    setSelectedEconomyModal(mapPhotoCardToModal(photoCard, currentPillar.pillarName));
    updateUrlParams({ item: photoCard.id });
  };

  const handleCloseModal = () => {
    setSelectedEconomyModal(null);
    updateUrlParams({ item: null });
  };

  if (!initialPillars || initialPillars.length === 0 || !currentPillar) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز قسم الاقتصاد"
        message="لم يتم إضافة بيانات القطاعات الاقتصادية حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="العمق الاقتصادي والإنتاجي للمحافظة"
        titlePrefix="اقتصاد وثروات"
        titleHighlight="أبين الخصيبة"
        description="سجل شامل لملحمة الذهب الأبيض (القطن)، بساتين المانجو، الثروة السمكية في شقرة وأحور، مناحل العسل الجبلي، وثروة الإبل والمواشي"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={pillarTabs}
        activeTab={activeEconomyTab}
        onSelectTab={handleSelectTab}
      />

      {/* MAIN ECONOMY PROFILE SHOWCASE */}
      <SmartContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={curtainOverlayVariants.initial}
            animate={curtainOverlayVariants.animate}
            exit={curtainOverlayVariants.exit}
            transition={curtainOverlayTransition}
            className="py-2 sm:py-6 text-right space-y-6 max-w-4xl mx-auto"
          >
            {/* Pillar Header */}
            <motion.div {...itemFadeInRight(0.05)} className="space-y-1">
              <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                قطاع {currentPillar.pillarName}
              </span>
              <span className="text-sm sm:text-base text-slate-500 font-abyan-title block">
                {currentPillar.subtitle}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              {...itemFadeInRight(0.1)}
              className="font-abyan-title text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-snug font-normal"
            >
              {currentPillar.title}
            </motion.h2>

            {/* Description Paragraph */}
            <motion.p
              {...itemFadeInRight(0.16)}
              className="text-sm sm:text-base lg:text-lg text-slate-800 font-abyan-body font-normal leading-relaxed pt-1"
            >
              {currentPillar.description}
            </motion.p>

            {/* VISUAL ECONOMY CARDS GRID USING FOODCARD CONTAINER */}
            {currentPillar.photoCards && (
              <motion.div {...itemFadeInRight(0.2)} className="pt-2 space-y-4">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  معرض صور ومشاهد قطاع {currentPillar.pillarName}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {currentPillar.photoCards.map((photoCard) => (
                    <FoodCard
                      key={photoCard.id}
                      foodCard={photoCard}
                      onClick={() => handleOpenPhotoModal(photoCard)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Key Products List */}
            <motion.div {...itemFadeInRight(0.24)} className="space-y-2 pt-2">
              <span className="text-sm sm:text-base font-normal text-slate-900 font-abyan-title block">
                أبرز المنتجات أو المشاريع المرتبطة بالقطاع:
              </span>
              <ul className="space-y-1.5 list-none p-0 m-0">
                {currentPillar.keyProducts.map((prod, idx) => (
                  <li
                    key={idx}
                    className="text-sm sm:text-base text-sky-600 font-abyan-body font-medium leading-relaxed"
                  >
                    • {prod}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Details & Economic Impact */}
            <motion.div {...itemFadeInRight(0.28)} className="space-y-1 pt-2">
              <span className="text-sm sm:text-base font-normal text-slate-900 font-abyan-title block">
                الأهمية الاقتصادية والتفاصيل التنموية:
              </span>
              <ul className="space-y-1.5 list-none p-0 m-0">
                {currentPillar.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="text-sm sm:text-base text-sky-600 font-abyan-body font-medium leading-relaxed"
                  >
                    • {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </SmartContainer>

      {/* UNIFIED MEDIA VIEWER MODAL FOR ECONOMY FULL DETAILS */}
      <UnifiedMediaViewer
        item={selectedEconomyModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
