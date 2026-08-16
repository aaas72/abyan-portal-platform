import React, { Suspense } from "react";
import GalleryDataWrapper from "./GalleryDataWrapper";
import { GalleryPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      {/* Real Navbar ALWAYS visible & persistent */}
      <Navbar activeSection="gallery" />

      {/* Main Content Area wrapped in Suspense with dedicated GalleryPageSkeleton */}
      <main className="pt-44 sm:pt-48 lg:pt-52 pb-16">
        <Suspense fallback={<GalleryPageSkeleton />}>
          <GalleryDataWrapper />
        </Suspense>
      </main>

      {/* Real Footer ALWAYS visible & persistent */}
      <Footer />
    </div>
  );
}
