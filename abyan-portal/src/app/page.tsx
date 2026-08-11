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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      {/* 150px Transparent Navbar with ONLY "أَبيَن" */}
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
