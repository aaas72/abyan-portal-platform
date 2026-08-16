import React from "react";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  CulturalHighlights,
  DistrictsSection,
  TimelineSection,
} from "@/components/landing";
import { AboutService } from "@/services/about.service";
import { HistoryService } from "@/services/history.service";
import { DistrictsService } from "@/services/districts.service";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "بوابة أبين الثقافية | مهد الحضارة والتراث والدلتا الخضراء",
  description:
    "الموسوعة الثقافية والتوثيقية الرسمية لمحافظة أبين: استكشف تاريخ مديريات أبين الـ 11 (زنجبار، خنفر، لودر، رصد، سرار، سباح، الوضيع، مودية، المحفد، أحور، جيشان)، قراها، حصونها التاريخية، وأعلامها.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "بوابة أبين الثقافية | مهد الحضارة والتراث والدلتا الخضراء",
    description:
      "الموسوعة الثقافية والتوثيقية الرسمية لمحافظة أبين: استكشف تاريخ مديريات أبين الـ 11، قراها، حصونها، وأعلامها.",
    type: "website",
    url: "/",
  },
};

export default async function Home() {
  const highlights = await AboutService.getHighlights();
  const eras = await HistoryService.getTimelineEras();
  const districts = await DistrictsService.getAllDistricts();
  const sections = await AboutService.getLandingSections();

  const heroSection = sections.find((s) => s.sectionId === "hero");
  const pillarsSection = sections.find(
    (s) => s.sectionId === "cultural-highlights",
  );
  const districtsSection = sections.find((s) => s.sectionId === "districts");
  const timelineSection = sections.find((s) => s.sectionId === "timeline");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abyanportal.org";

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "بوابة أبين الثقافية",
        "description": "الموسوعة الثقافية والتوثيقية لمحافظة أبين",
        "inLanguage": "ar",
      },
      {
        "@type": "AdministrativeArea",
        "@id": `${siteUrl}/#abyan`,
        "name": "محافظة أبين",
        "alternateName": "Abyan Governorate",
        "description": "إحدى محافظات الجمهورية اليمنية وتقع في جنوب البلاد.",
        "containedInPlace": {
          "@type": "Country",
          "name": "اليمن"
        },
        "containsPlace": districts.map((d) => ({
          "@type": "AdministrativeArea",
          "name": `مديرية ${d.name}`,
          "url": `${siteUrl}/districts?id=${d.id}`,
        })),
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* 150px Transparent Navbar with ONLY "بوابة أبين" */}
      <Navbar />

      {/* Main Page Layout with Optimized Logical Narrative Flow */}
      <main>
        {/* 1. Full-Viewport Framed Hero */}
        <Hero data={heroSection} />

        {/* 2. Landing Pillars & Cultural Treasures Showcase */}
        <CulturalHighlights
          highlights={highlights}
          sectionData={pillarsSection}
        />

        {/* 3. Interactive Vector Map & Districts Section */}
        <DistrictsSection
          districts={districts}
          sectionData={districtsSection}
        />

        {/* 4. Dynamic Horizontal Timeline Section */}
        <TimelineSection eras={eras} sectionData={timelineSection} />
      </main>

      {/* Pure Text Footer */}
      <Footer />
    </div>
  );
}
