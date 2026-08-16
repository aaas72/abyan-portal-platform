import React, { Suspense } from "react";
import { Metadata } from "next";
import LandmarksDataWrapper from "./LandmarksDataWrapper";
import { LandmarksPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";
import { LandmarksService } from "@/services/landmarks.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let title = "المعالم السياحية والأثرية | بوابة أبين";
  let description = "استكشاف المعالم الأثرية والتاريخية والسياحية في محافظة أبين.";

  if (queryId) {
    try {
      const allCategories = await LandmarksService.getCategories();
      const activeCategory = allCategories.find(c => c.id === queryId);
      if (activeCategory) {
        title = `${activeCategory.title} | بوابة أبين`;
        description = activeCategory.description.substring(0, 150) + "...";
      }
    } catch (e) {}
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
    },
  };
}

export default async function LandmarksPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let jsonLd = null;
  if (queryId) {
    try {
      const allCategories = await LandmarksService.getCategories();
      const activeCategory = allCategories.find(c => c.id === queryId);
      if (activeCategory) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          "name": activeCategory.title,
          "description": activeCategory.description,
          "publicAccess": true
        };
      }
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Real Navbar ALWAYS visible & persistent */}
      <Navbar activeSection="landmarks" />

      {/* Main Content Area wrapped in Suspense */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<LandmarksPageSkeleton />}>
          <LandmarksDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
