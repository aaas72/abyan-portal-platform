import React, { Suspense } from "react";
import { Metadata } from "next";
import EconomyDataWrapper from "./EconomyDataWrapper";
import { EconomyPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";
import { EconomyService } from "@/services/economy.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let title = "الاقتصاد والزراعة | بوابة أبين";
  let description = "اكتشف الموارد الاقتصادية والزراعية في محافظة أبين.";

  if (queryId) {
    try {
      const allPillars = await EconomyService.getPillars();
      const activePillar = allPillars.find(c => c.id === queryId);
      if (activePillar) {
        title = `${activePillar.title} | بوابة أبين`;
        description = activePillar.description.substring(0, 150) + "...";
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

export default async function EconomyPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let jsonLd = null;
  if (queryId) {
    try {
      const allPillars = await EconomyService.getPillars();
      const activePillar = allPillars.find(c => c.id === queryId);
      if (activePillar) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": activePillar.title,
          "description": activePillar.description,
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
      <Navbar activeSection="economy" />

      {/* Main Content Area wrapped in Suspense with dedicated EconomyPageSkeleton */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<EconomyPageSkeleton />}>
          <EconomyDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
