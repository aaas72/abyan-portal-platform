import React, { Suspense } from "react";
import HistoryDataWrapper from "./HistoryDataWrapper";
import { HistoryPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";

// Layer 1: sync Server Component — persistent shell + Suspense boundary
export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
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
