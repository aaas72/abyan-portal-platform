import React, { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import DistrictsDataWrapper from "./DistrictsDataWrapper";
import { DistrictsPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";
import { DistrictsService } from "@/services/districts.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const queryDistrictId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let title = "موسوعة المديريات | بوابة أبين";
  let description = "دليل شامل وتفصيلي للمديريات والتقسيم الإداري والجغرافي في محافظة أبين.";

  if (queryDistrictId) {
    try {
      const allDistricts = await DistrictsService.getAllDistricts();
      const activeDistrict = allDistricts.find(d => d.id === queryDistrictId);
      if (activeDistrict) {
        title = `مديرية ${activeDistrict.name} | بوابة أبين`;
        description = activeDistrict.description.substring(0, 150) + "...";
      }
    } catch (e) {
      // Fallback to default
    }
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

export default async function DistrictsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryDistrictId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let jsonLd = null;
  if (queryDistrictId) {
    try {
      const allDistricts = await DistrictsService.getAllDistricts();
      const activeDistrict = allDistricts.find(d => d.id === queryDistrictId);
      if (activeDistrict) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": `مديرية ${activeDistrict.name}`,
          "description": activeDistrict.description,
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "محافظة أبين",
            "addressCountry": "YE"
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
      {/* Real Navbar ALWAYS visible & persistent */}
      <Navbar activeSection="districts" />

      {/* Main Content Area wrapped in Suspense with dedicated DistrictsPageSkeleton */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<DistrictsPageSkeleton />}>
          <DistrictsDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
