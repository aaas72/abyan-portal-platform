import React, { Suspense } from "react";
import { Metadata } from "next";
import HistoryDataWrapper from "./HistoryDataWrapper";
import { HistoryPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";
import { HistoryService } from "@/services/history.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let title = "التاريخ والنشأة | بوابة أبين";
  let description = "تتبع تاريخ أبين ومراحل نشأتها عبر الحقب التاريخية المختلفة.";

  if (queryId) {
    try {
      const allEras = await HistoryService.getEras();
      const activeEra = allEras.find(e => e.id === queryId);
      if (activeEra) {
        title = `${activeEra.eraTitle} | بوابة أبين`;
        description = activeEra.shortSummary.substring(0, 150) + "...";
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

// Layer 1: sync Server Component — persistent shell + Suspense boundary
export default async function HistoryPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let jsonLd = null;
  if (queryId) {
    try {
      const allEras = await HistoryService.getEras();
      const activeEra = allEras.find(e => e.id === queryId);
      if (activeEra) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": activeEra.eraTitle,
          "description": activeEra.shortSummary,
          "startDate": activeEra.startYear,
          "endDate": activeEra.endYear,
          "location": {
            "@type": "Place",
            "name": "أبين"
          }
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
      {/* Real Navbar — ALWAYS visible & persistent outside Suspense */}
      <Navbar activeSection="history" />

      {/* Main content with safe top padding below 150px Navbar */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<HistoryPageSkeleton />}>
          <HistoryDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer — ALWAYS visible & persistent outside Suspense */}
      <Footer />
    </div>
  );
}
