"use client";

import React from "react";

/* =============================================================================
   🌿 ABYAN SHIMMER BASE ATOMS
   ============================================================================= */

export function SkeletonBase({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-abyan-shimmer-rtl border-none shadow-none outline-none ${className}`} />
  );
}

export function SkeletonTextLine({
  height = "h-3.5",
  width = "w-full",
  className = "",
}: {
  height?: string;
  width?: string;
  className?: string;
}) {
  return <SkeletonBase className={`${height} ${width} rounded-md ${className}`} />;
}

/** RTL-aware paragraph skeleton — محاذاة من اليمين دائماً */
export function SkeletonParagraph({
  lines = 3,
  className = "",
}: {
  lines?: number;
  /** @deprecated align no longer needed — always RTL */
  align?: "right" | "center" | "left";
  className?: string;
}) {
  const lineWidths = ["w-full", "w-[92%]", "w-[85%]", "w-[65%]"];
  return (
    <div dir="rtl" className={`space-y-2 pt-1 flex flex-col items-start ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <SkeletonTextLine key={idx} height="h-3" width={lineWidths[idx % lineWidths.length]} />
      ))}
    </div>
  );
}

/* =============================================================================
   🧩 SHARED REUSABLE SKELETON ATOMS (Hero + Tabs + Cards)
   ============================================================================= */

export function SubpageHeroSkeleton() {
  return (
    <section dir="rtl" className="pt-6 sm:pt-10 pb-6 sm:pb-8 text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
      <SkeletonBase className="h-6 sm:h-7 w-36 sm:w-48 mx-auto rounded-full" />
      <div className="pt-1 flex justify-center">
        <SkeletonTextLine height="h-8 sm:h-11" width="w-3/4 max-w-md" className="rounded-xl" />
      </div>
      <div className="pt-1 max-w-2xl mx-auto space-y-2">
        <SkeletonTextLine height="h-3.5" width="w-full" className="mx-auto" />
        <SkeletonTextLine height="h-3.5" width="w-4/5" className="mx-auto" />
      </div>
    </section>
  );
}

export function CategoryTabSelectorSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 relative z-10">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        <SkeletonBase className="h-7 w-5 rounded-md shrink-0" />
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonBase key={i} className={`h-8 sm:h-9 rounded-full shrink-0 ${i === 0 ? "w-28 sm:w-36" : "w-24 sm:w-32"}`} />
        ))}
        <SkeletonBase className="h-7 w-5 rounded-md shrink-0" />
      </div>
    </div>
  );
}

export function PioneerCardSkeleton() {
  return (
    <div dir="rtl" className="bg-white/95 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-none shadow-none space-y-4 text-right w-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <SkeletonBase className="h-5 w-24 rounded-full shrink-0" />
        <SkeletonTextLine height="h-5 sm:h-6" width="w-1/2" />
      </div>
      <SkeletonTextLine height="h-3.5" width="w-1/3" />
      <SkeletonParagraph lines={3} />
      <div className="pt-3 flex items-center justify-between">
        <SkeletonBase className="h-4 w-14 rounded-md" />
        <SkeletonTextLine height="h-3" width="w-28" />
      </div>
    </div>
  );
}

export function ImageShowcaseCardSkeleton() {
  return (
    <div dir="rtl" className="bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-none shadow-none space-y-3.5 text-right w-full flex flex-col justify-between">
      <SkeletonBase className="w-full aspect-video rounded-xl sm:rounded-2xl" />
      <div className="space-y-2">
        <SkeletonTextLine height="h-5 sm:h-6" width="w-3/4" />
        <SkeletonParagraph lines={2} />
      </div>
      <div className="pt-1 flex justify-start">
        <SkeletonBase className="h-3.5 w-16 rounded-md" />
      </div>
    </div>
  );
}

export const ContentCardSkeleton = ImageShowcaseCardSkeleton;

export function FoodCardSkeleton() {
  return (
    <div dir="rtl" className="bg-white/95 rounded-2xl p-4 border-none shadow-none space-y-3 text-right w-full flex flex-col justify-between">
      <SkeletonBase className="w-full aspect-square rounded-xl" />
      <div className="space-y-1.5">
        <SkeletonTextLine height="h-4 sm:h-5" width="w-4/5" />
        <SkeletonParagraph lines={2} />
      </div>
      <div className="pt-1 flex justify-start">
        <SkeletonBase className="h-3.5 w-14 rounded-md" />
      </div>
    </div>
  );
}

export function DistrictDetailSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      {/* DESKTOP */}
      <div className="hidden lg:flex gap-8 items-start w-full">
        {/* Right sidebar list */}
        <div className="w-[270px] shrink-0 space-y-3">
          <SkeletonTextLine height="h-3.5" width="w-44" className="mb-2" />
          <div className="grid grid-cols-1 gap-1.5 border-none shadow-none ps-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="py-3 px-1 space-y-1.5">
                <SkeletonTextLine height="h-4" width="w-3/4" />
                <SkeletonTextLine height="h-3" width="w-1/2" />
              </div>
            ))}
          </div>
        </div>
        {/* Left active panel */}
        <div className="flex-1 min-w-0 bg-white border-none shadow-none rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <SkeletonTextLine height="h-3.5" width="w-40" />
            <SkeletonTextLine height="h-3" width="w-56" />
          </div>
          <div className="space-y-2">
            <SkeletonTextLine height="h-8 sm:h-10" width="w-2/3" className="rounded-xl" />
            <SkeletonTextLine height="h-4" width="w-1/2" />
          </div>
          <div className="flex gap-2 py-1 overflow-x-auto no-scrollbar">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonBase key={i} className={`h-8 rounded-full shrink-0 ${i === 0 ? "w-28" : "w-24"}`} />
            ))}
          </div>
          <div className="space-y-5 pt-2">
            <SkeletonParagraph lines={4} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <PioneerCardSkeleton />
              <PioneerCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden space-y-3">
        <SkeletonTextLine height="h-3.5" width="w-44" className="mb-3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="pb-4 space-y-2">
            <div className="py-2 flex items-center justify-between">
              <SkeletonBase className="h-3.5 w-16 rounded" />
              <div className="space-y-1 flex-1 pe-3">
                <SkeletonTextLine height="h-5" width="w-1/2" />
                <SkeletonTextLine height="h-3" width="w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaViewerModalSkeleton() {
  return (
    <div dir="rtl" className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl w-full shadow-none border-none">
      <div className="flex gap-4 sm:gap-6 items-start">
        <SkeletonBase className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl shrink-0" />
        <div className="space-y-3 flex-1">
          <SkeletonBase className="h-4 w-24 rounded" />
          <SkeletonTextLine height="h-7" width="w-3/4" className="rounded-lg" />
          <SkeletonTextLine height="h-4" width="w-1/2" />
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <SkeletonTextLine height="h-5" width="w-44" />
        <SkeletonParagraph lines={4} />
      </div>
    </div>
  );
}

/* =============================================================================
   🏛️ LANDMARKS PAGE SKELETON (/landmarks)
   ============================================================================= */
export function LandmarksPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={5} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-6 space-y-6 max-w-4xl mx-auto">

          {/* Category Subtitle & Header */}
          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-28" className="rounded-md" />
            <SkeletonTextLine height="h-3" width="w-44" className="rounded-sm" />
          </div>

          {/* H2 Main Title */}
          <SkeletonTextLine height="h-9 sm:h-11" width="w-2/3" className="rounded-xl" />

          {/* Description Paragraph */}
          <SkeletonParagraph lines={3} />

          {/* Section label + 3-col ImageShowcaseCard Grid */}
          <div className="pt-2 space-y-4">
            <SkeletonTextLine height="h-3.5" width="w-48" className="rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <ImageShowcaseCardSkeleton />
              <ImageShowcaseCardSkeleton />
              <ImageShowcaseCardSkeleton />
            </div>
          </div>

          {/* Section label + Bullet list */}
          <div className="space-y-2 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-52" className="rounded-md" />
            <div className="space-y-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTextLine key={i} height="h-3.5" width={["w-[80%]", "w-[72%]", "w-[76%]", "w-[68%]"][i]} className="rounded-md" />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-56" className="rounded-md" />
            <SkeletonTextLine height="h-3.5" width="w-full" className="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🗺️ DISTRICTS PAGE SKELETON (/districts)
   ============================================================================= */
export function DistrictsPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={4} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DistrictDetailSkeleton />
      </div>
    </div>
  );
}

/* =============================================================================
   📜 PIONEERS PAGE SKELETON (/pioneers)
   ============================================================================= */
export function PioneersPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={5} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 max-w-4xl mx-auto">

          {/* Category Header */}
          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-28" className="rounded-md" />
            <SkeletonTextLine height="h-9 sm:h-10" width="w-3/5" className="rounded-xl" />
            <SkeletonTextLine height="h-3" width="w-40" className="rounded-sm" />
          </div>

          {/* 2-col PioneerCard grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PioneerCardSkeleton />
            <PioneerCardSkeleton />
            <PioneerCardSkeleton />
            <PioneerCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🎨 CULTURE PAGE SKELETON (/culture)
   ============================================================================= */
export function CulturePageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={5} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-6 space-y-6 max-w-4xl mx-auto">

          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-28" className="rounded-md" />
            <SkeletonTextLine height="h-3" width="w-44" className="rounded-sm" />
          </div>

          <SkeletonTextLine height="h-9 sm:h-11" width="w-3/5" className="rounded-xl" />

          <SkeletonParagraph lines={3} />

          {/* Audio Player bar */}
          <div className="pt-2">
            <SkeletonTextLine height="h-3.5" width="w-44" className="mb-2 rounded-md" />
            <SkeletonBase className="h-16 w-full rounded-2xl" />
          </div>

          {/* 3-col FoodCard grid */}
          <div className="pt-3 space-y-4">
            <SkeletonTextLine height="h-3.5" width="w-60" className="rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FoodCardSkeleton />
              <FoodCardSkeleton />
              <FoodCardSkeleton />
            </div>
          </div>

          {/* Excerpts */}
          <div className="space-y-2 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-48" className="rounded-md" />
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonTextLine key={i} height="h-3.5" width={["w-[85%]", "w-[78%]", "w-[70%]"][i]} className="rounded-md" />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-48" className="rounded-md" />
            <SkeletonTextLine height="h-3.5" width="w-full" className="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🌴 ECONOMY PAGE SKELETON (/economy)
   ============================================================================= */
export function EconomyPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={5} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-6 space-y-6 max-w-4xl mx-auto">

          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-32" className="rounded-md" />
            <SkeletonTextLine height="h-3" width="w-48" className="rounded-sm" />
          </div>

          <SkeletonTextLine height="h-9 sm:h-11" width="w-3/5" className="rounded-xl" />

          <SkeletonParagraph lines={3} />

          <div className="pt-2 space-y-4">
            <SkeletonTextLine height="h-3.5" width="w-52" className="rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FoodCardSkeleton />
              <FoodCardSkeleton />
              <FoodCardSkeleton />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-56" className="rounded-md" />
            <div className="space-y-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTextLine key={i} height="h-3.5" width={["w-[78%]", "w-[70%]", "w-[74%]", "w-[66%]"][i]} className="rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <SkeletonTextLine height="h-3.5" width="w-52" className="rounded-md" />
            <SkeletonTextLine height="h-3.5" width="w-full" className="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🖼️ GALLERY PAGE SKELETON (/gallery)
   ============================================================================= */
export function GalleryPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />
      <CategoryTabSelectorSkeleton count={6} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 sm:py-6 space-y-6 max-w-5xl mx-auto">

          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-36" className="rounded-md" />
            <SkeletonTextLine height="h-9 sm:h-10" width="w-2/5" className="rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ImageShowcaseCardSkeleton />
            <ImageShowcaseCardSkeleton />
            <ImageShowcaseCardSkeleton />
            <ImageShowcaseCardSkeleton />
            <ImageShowcaseCardSkeleton />
            <ImageShowcaseCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   📖 ABOUT PAGE SKELETON (/about)
   ============================================================================= */
export function AboutPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />

      {/* SECTION 1: Vision & Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="py-2 sm:py-4 space-y-4">
            <SkeletonTextLine height="h-3.5" width="w-24" className="rounded-md" />
            <SkeletonTextLine height="h-8 sm:h-10" width="w-3/4" className="rounded-xl" />
            <SkeletonParagraph lines={3} />
          </div>
          {/* 4-col stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl text-center space-y-2">
                <SkeletonBase className="h-8 w-16 mx-auto rounded-lg" />
                <SkeletonTextLine height="h-3" width="w-20" className="mx-auto rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Strategic Pillars */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-28" className="rounded-md" />
            <SkeletonTextLine height="h-7 sm:h-8" width="w-3/5" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-2xl space-y-3">
                <SkeletonTextLine height="h-5" width="w-1/2" className="rounded-md" />
                <SkeletonParagraph lines={2} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Scopes */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-24" className="rounded-md" />
            <SkeletonTextLine height="h-7 sm:h-8" width="w-1/2" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl space-y-3">
                <SkeletonTextLine height="h-3.5" width="w-4/5" className="rounded-md" />
                <SkeletonTextLine height="h-5" width="w-3/4" className="rounded-md" />
                <div className="space-y-2 pt-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <SkeletonTextLine key={j} height="h-3" width={["w-[85%]", "w-[75%]", "w-[80%]"][j]} className="rounded-sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Values */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1">
            <SkeletonTextLine height="h-3.5" width="w-24" className="rounded-md" />
            <SkeletonTextLine height="h-7 sm:h-8" width="w-2/5" className="rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-2xl space-y-3">
                <SkeletonTextLine height="h-5" width="w-2/5" className="rounded-md" />
                <SkeletonParagraph lines={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🕰️ HISTORY PAGE SKELETON (/history)
   ============================================================================= */
export function HistoryPageSkeleton() {
  return (
    <div dir="rtl" className="w-full">
      <SubpageHeroSkeleton />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* MOBILE: Accordion list */}
        <div className="block lg:hidden space-y-3">
          <SkeletonTextLine height="h-3.5" width="w-56" className="mb-3 rounded-md" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="pb-4 border-b border-slate-100 space-y-1.5">
              <div className="py-2 flex items-center justify-between">
                <SkeletonBase className="h-3.5 w-14 rounded-md shrink-0" />
                <div className="space-y-1 flex-1 pe-3">
                  <SkeletonTextLine height="h-3" width="w-20" className="rounded-sm" />
                  <SkeletonTextLine height="h-5 sm:h-6" width="w-1/2" className="rounded-md" />
                  <SkeletonTextLine height="h-3" width="w-3/5" className="rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP: 12-col 2-column layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">

          {/* Right col-4: eras selector list */}
          <div className="lg:col-span-4 max-w-sm space-y-3">
            <SkeletonTextLine height="h-3.5" width="w-52" className="mb-2 rounded-md" />
            <div className="space-y-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-3.5 px-1 border-b border-slate-100 last:border-none space-y-1">
                  <SkeletonTextLine height="h-3" width="w-24" className="rounded-sm" />
                  <SkeletonTextLine height="h-5" width="w-3/4" className="rounded-md" />
                  <SkeletonTextLine height="h-3" width="w-full" className="rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Left col-8: active era detail panel */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-8 space-y-6">

              <div className="space-y-1">
                <SkeletonTextLine height="h-3.5" width="w-28" className="rounded-md" />
                <SkeletonTextLine height="h-3" width="w-56" className="rounded-sm" />
              </div>

              <SkeletonTextLine height="h-9 sm:h-11" width="w-2/3" className="rounded-xl" />

              <SkeletonParagraph lines={4} />

              <div className="space-y-2 pt-2">
                <SkeletonTextLine height="h-3.5" width="w-52" className="rounded-md" />
                <div className="space-y-1.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonTextLine key={i} height="h-3.5" width={["w-[80%]", "w-[72%]", "w-[77%]", "w-[68%]"][i]} className="rounded-md" />
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <SkeletonTextLine height="h-3.5" width="w-48" className="rounded-md" />
                <SkeletonTextLine height="h-3.5" width="w-full" className="rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   🔄 LEGACY GENERIC FALLBACK (Kept for compatibility only)
   ============================================================================= */
export function PageSkeleton({
  gridType = "cards",
}: {
  gridType?: "cards" | "pioneers" | "districts" | "food";
  count?: number;
}) {
  if (gridType === "districts") return <DistrictsPageSkeleton />;
  if (gridType === "pioneers") return <PioneersPageSkeleton />;
  if (gridType === "food") return <EconomyPageSkeleton />;
  return <LandmarksPageSkeleton />;
}

/* =============================================================================
   📞 CONTACT PAGE SKELETON
   ============================================================================= */

export function ContactPageSkeleton() {
  return (
    <>
      <SubpageHeroSkeleton />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-start text-center space-y-4">
              <SkeletonTextLine height="h-6" width="w-24" className="mx-auto" />
              <SkeletonTextLine height="h-3" width="w-48" className="mx-auto" />
              <div className="space-y-2 pt-2">
                <SkeletonTextLine height="h-5" width="w-32" className="mx-auto rounded-md" />
                <SkeletonTextLine height="h-5" width="w-32" className="mx-auto rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =============================================================================
   ©️ COPYRIGHT PAGE SKELETON
   ============================================================================= */

export function CopyrightPageSkeleton() {
  return (
    <>
      <SubpageHeroSkeleton />
      
      {/* Section 1: Declarations Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 mt-12 text-right" dir="rtl">
        <div className="space-y-4">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-8" width="w-64" />
          <SkeletonParagraph lines={3} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-5" width="w-40" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Pillars Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-6" width="w-56" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-3" width="w-16" />
              <SkeletonTextLine height="h-5" width="w-32" />
              <SkeletonParagraph lines={3} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 & 4: General Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-6" width="w-56" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-6" width="w-48" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =============================================================================
   📜 TERMS OF SERVICE PAGE SKELETON (/terms)
   ============================================================================= */

export function TermsPageSkeleton() {
  return (
    <>
      <SubpageHeroSkeleton />
      
      {/* Intro Section Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 mt-12 text-right" dir="rtl">
        <div className="space-y-4">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-8" width="w-64" />
          <SkeletonParagraph lines={3} />
        </div>
      </div>

      {/* Usage Rules Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-28" />
          <SkeletonTextLine height="h-6" width="w-56" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-5" width="w-40" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Intellectual Property & Disclaimer Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-6" width="w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-5" width="w-36" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =============================================================================
   🔒 PRIVACY POLICY PAGE SKELETON (/privacy)
   ============================================================================= */

export function PrivacyPageSkeleton() {
  return (
    <>
      <SubpageHeroSkeleton />
      
      {/* Intro Section Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 mt-12 text-right" dir="rtl">
        <div className="space-y-4">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-8" width="w-64" />
          <SkeletonParagraph lines={3} />
        </div>
      </div>

      {/* Data Collection Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-28" />
          <SkeletonTextLine height="h-6" width="w-56" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-5" width="w-40" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>

      {/* Usage & Protection Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 mt-16 text-right" dir="rtl">
        <div className="space-y-3">
          <SkeletonTextLine height="h-3" width="w-24" />
          <SkeletonTextLine height="h-6" width="w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-3">
              <SkeletonTextLine height="h-5" width="w-36" />
              <SkeletonParagraph lines={2} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
