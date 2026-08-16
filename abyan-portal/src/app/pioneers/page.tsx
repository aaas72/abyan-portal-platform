import React, { Suspense } from "react";
import { Metadata } from "next";
import PioneersDataWrapper from "./PioneersDataWrapper";
import { PioneersPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";
import { PioneersService } from "@/services/pioneers.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let title = "الأعلام والشخصيات | بوابة أبين";
  let description = "تعرف على رواد وأعلام وشخصيات محافظة أبين المؤثرة عبر التاريخ.";

  if (queryId) {
    try {
      const allCategories = await PioneersService.getCategories();
      const activeCategory = allCategories.find(c => c.id === queryId);
      if (activeCategory) {
        title = `${activeCategory.title} | بوابة أبين`;
        description = activeCategory.subtitle.substring(0, 150) + "...";
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

export default async function PioneersPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const queryId = typeof resolvedParams.id === "string" ? resolvedParams.id : null;

  let jsonLd = null;
  if (queryId) {
    try {
      const allCategories = await PioneersService.getCategories();
      const activeCategory = allCategories.find(c => c.id === queryId);
      if (activeCategory) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": activeCategory.title,
          "description": activeCategory.subtitle,
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
      <Navbar activeSection="pioneers" />

      {/* Main Content Area wrapped in Suspense with dedicated PioneersPageSkeleton */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<PioneersPageSkeleton />}>
          <PioneersDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
