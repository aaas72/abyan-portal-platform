"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, CategoryTabSelector, UnifiedMediaViewer, MediaItem, EmptyState } from "@/components/ui";
import ImageShowcaseCard from "@/components/cards/ImageShowcaseCard";
import { ArchiveItem } from "@/types/schemas";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
} from "@/lib/animations";

interface GalleryClientProps {
  initialCategories: { id: string; label: string }[];
  galleryItems: ArchiveItem[];
}

export default function GalleryClient({ initialCategories, galleryItems }: GalleryClientProps) {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<MediaItem | null>(null);

  const validTabs = useMemo(() => {
    return initialCategories.filter((c) => 
      c.id === "all" || galleryItems.some((item) => item.category === c.id)
    );
  }, [initialCategories, galleryItems]);

  const filteredItems = useMemo(() => {
    if (activeCategoryTab === "all") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategoryTab);
  }, [galleryItems, activeCategoryTab]);

  if (!galleryItems || galleryItems.length === 0) {
    return (
      <EmptyState 
        title="انتظرونا قريباً لتجهيز معرض الصور"
        message="لم يتم إضافة صور تاريخية وتوثيقية حتى الآن. يرجى العودة لاحقاً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="الأرشيف والذاكرة البصرية التراثية"
        titlePrefix="أرشيف ومعرض"
        titleHighlight="ذاكرة أبين المصورة"
        description="مجموعة وثائقية نادرة للمشاهد الجغرافية، الحصون الأثرية، الرواد، وحياة الريف والبحر بمحافظة أبين"
      />

      {/* REUSABLE CATEGORY TAB SELECTOR */}
      <CategoryTabSelector
        tabs={validTabs}
        activeTab={activeCategoryTab}
        onSelectTab={setActiveCategoryTab}
      />

      {/* GALLERY SHOWCASE GRID */}
      <SmartContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryTab}
            initial={curtainOverlayVariants.initial}
            animate={curtainOverlayVariants.animate}
            exit={curtainOverlayVariants.exit}
            transition={curtainOverlayTransition}
            className="py-2 sm:py-6 text-right space-y-6 max-w-5xl mx-auto"
          >
            {/* Header Title */}
            <motion.div {...itemFadeInRight(0.05)} className="space-y-1">
              <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                الأرشيف الرقمي الموثق
              </span>
              <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                سجل الصور واللوحات الوثائقية
              </h2>
            </motion.div>

            {/* GALLERY CARDS GRID */}
            <motion.div {...itemFadeInRight(0.12)} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ImageShowcaseCard
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.title,
                    tag: item.year,
                    location: item.location,
                    authorName: item.authorName,
                    description: item.description,
                    bgGradient: item.bgGradient,
                    images: item.images, // Pass all images
                  }}
                  onClick={() =>
                    setSelectedGalleryModal({
                      id: item.id,
                      title: item.title,
                      subtitle: `${item.year} • ${item.location}`,
                      authorName: item.authorName,
                      fullBiography: item.description,
                      location: item.location,
                      year: item.year,
                      categoryLabel: "الأرشيف الرقمي لبوابة أبين",
                      description: item.description,
                      bgGradient: item.bgGradient,
                      images: item.images, // Pass the whole array
                    })
                  }
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </SmartContainer>

      {/* UNIFIED MEDIA VIEWER MODAL FOR GALLERY PHOTO FULL VIEW */}
      <UnifiedMediaViewer
        item={selectedGalleryModal}
        onClose={() => setSelectedGalleryModal(null)}
      />
    </>
  );
}
