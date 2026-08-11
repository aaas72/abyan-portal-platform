"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, CategoryTabSelector, FolkAudioPlayer, UnifiedMediaViewer, MediaItem, EmptyState } from "@/components/ui";
import FoodCard from "@/components/cards/FoodCard";
import ImageShowcaseCard from "@/components/cards/ImageShowcaseCard";
import { CultureCategory, AudioTrack } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";

interface CultureClientProps {
  initialCategories: CultureCategory[];
  folkAudioTracks: AudioTrack[];
}

const hasContent = (c: CultureCategory) => {
  return (c.items && c.items.length > 0) || (c.details && c.details.length > 0);
};

export default function CultureClient({ initialCategories, folkAudioTracks }: CultureClientProps) {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(() => {
    const valid = initialCategories.find(hasContent);
    return valid ? valid.id : "dan";
  });
  const [selectedCultureModal, setSelectedCultureModal] = useState<MediaItem | null>(null);

  const categoryTabs = useMemo(() => {
    return initialCategories
      .filter(hasContent)
      .map((c) => ({
        id: c.id,
        label: c.categoryName,
      }));
  }, [initialCategories]);

  const currentCategory = useMemo(() => {
    const validData = initialCategories.filter(hasContent);
    return validData.find((c) => c.id === activeCategoryTab) || validData[0];
  }, [initialCategories, activeCategoryTab]);

  if (!initialCategories || initialCategories.length === 0 || !currentCategory) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز قسم الثقافة"
        message="لم يتم إضافة بيانات الثقافة والتراث حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="الموروث الشفاهي، الفلكلور، والمطبخ الأصيل"
        titlePrefix="ثقافة وفنون"
        titleHighlight="أبين التراثية"
        description="استعراض حي لروائع شعر الدان الأبيني، أهازيج المهاجل الزراعية، إيقاعات الشرح والهودون، وأصالة المائدة الأبينية"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={categoryTabs}
        activeTab={activeCategoryTab}
        onSelectTab={setActiveCategoryTab}
      />

      {/* CULTURE SHOWCASE PANEL */}
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
                قسم {currentCategory.categoryName}
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
              className="text-xs sm:text-sm text-[#1e293b] font-abyan-body font-normal leading-relaxed pt-1"
            >
              {currentCategory.description}
            </motion.p>

            {/* AUDIO PLAYER (FOR DAN & FOLK TRACKS) */}
            {currentCategory.audioTrack && (
              <motion.div {...itemFadeInRight(0.2)} className="pt-2">
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block mb-2">
                  استماع للتسجيل الشفاهي الموثق:
                </span>
                <FolkAudioPlayer activeTrack={currentCategory.audioTrack} tracks={folkAudioTracks} />
              </motion.div>
            )}

            {/* ITEMS PHOTO CARDS SHOWCASE (FOR ALL CULTURE CATEGORIES) */}
            {currentCategory.items && currentCategory.items.length > 0 && (
              <motion.div {...itemFadeInRight(0.24)} className="pt-3 space-y-4">
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
                  معرض عناصر ومأثورات الفئة:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {currentCategory.items.map((item) => (
                    <FoodCard
                      key={item.id}
                      foodCard={item}
                      onClick={() =>
                        setSelectedCultureModal({
                          id: item.id,
                          title: item.title,
                          subtitle: item.tag,
                          fullBiography: item.description,
                          location: item.location,
                          categoryLabel: currentCategory.title,
                          description: item.description,
                          bgGradient: item.bgGradient,
                          images: item.images,
                        })
                      }
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* VISUAL SHOWCASE CARD (FOR STORYTELLING) */}
            {currentCategory.visualShowcase && (
              <motion.div {...itemFadeInRight(0.24)} className="pt-3 space-y-3">
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
                  مشهد ومأثورات الحكايات الشعبية:
                </span>
                <ImageShowcaseCard
                  item={{
                    id: "visual-storytelling",
                    title: currentCategory.visualShowcase.title,
                    tag: currentCategory.visualShowcase.tag,
                    description: currentCategory.visualShowcase.description,
                    bgGradient: currentCategory.visualShowcase.bgGradient,
                  }}
                  onClick={() =>
                    setSelectedCultureModal({
                      id: "visual-storytelling",
                      title: currentCategory.visualShowcase?.title || "مجالس الحكايات والأمثال الشفاهية في أبين",
                      subtitle: currentCategory.visualShowcase?.tag || "معرض المشاهد والحكايات الشعبية",
                      fullBiography: currentCategory.visualShowcase?.description || "توثيق بصرِي لمجالس كبار السن وحكايات البحارة والمزارعين في شقرة وجعار ولودر",
                      categoryLabel: "التراث السردي الشفاهي",
                      bgGradient: currentCategory.visualShowcase?.bgGradient,
                      images: currentCategory.visualShowcase?.images,
                    })
                  }
                />
              </motion.div>
            )}

            {/* PRIMARY TAGS */}
            {currentCategory.primaryTags && currentCategory.primaryTags.length > 0 && (
              <motion.div {...itemFadeInRight(0.26)} className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-2" dir="rtl">
                  {currentCategory.primaryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DETAILS */}
            {currentCategory.details && currentCategory.details.length > 0 && (
              <motion.div {...itemFadeInRight(0.3)} className="space-y-4 pt-4">
                <span className="text-xs font-normal text-[#10b981] font-abyan-title block mb-2">
                  تفاصيل ورصد التوثيق:
                </span>
                <div className="flex flex-col gap-3" dir="rtl">
                  {currentCategory.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-xs sm:text-sm text-[#1e293b] font-abyan-body font-normal leading-relaxed"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </SmartContainer>

      {/* UNIFIED MEDIA VIEWER MODAL FOR CULTURE DETAILS */}
      <UnifiedMediaViewer
        item={selectedCultureModal}
        onClose={() => setSelectedCultureModal(null)}
      />
    </>
  );
}
