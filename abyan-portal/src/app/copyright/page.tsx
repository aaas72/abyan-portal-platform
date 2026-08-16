import React, { Suspense } from "react";
import CopyrightDataWrapper from "./CopyrightDataWrapper";
import { CopyrightPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Layer 1: sync Server Component — persistent shell + Suspense boundary
export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      {/* Real Navbar — ALWAYS visible & persistent outside Suspense */}
      <Navbar activeSection="about" />

      {/* Main content with safe top padding below 150px Navbar */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-20 space-y-16">
        <Suspense fallback={<CopyrightPageSkeleton />}>
          <CopyrightDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer — ALWAYS visible & persistent outside Suspense */}
      <Footer />
    </div>
  );
}
