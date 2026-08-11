import React, { Suspense } from "react";
import CultureDataWrapper from "./CultureDataWrapper";
import { CulturePageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      {/* Real Navbar ALWAYS visible & persistent */}
      <Navbar activeSection="culture" />

      {/* Main Content Area wrapped in Suspense with dedicated CulturePageSkeleton */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<CulturePageSkeleton />}>
          <CultureDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
