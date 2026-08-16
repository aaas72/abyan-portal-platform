import React, { Suspense } from "react";
import ContactDataWrapper from "./ContactDataWrapper";
import { ContactPageSkeleton } from "@/components/ui/Skeletons";
import { Navbar, Footer } from "@/components/layout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-cairo selection:bg-sky-500 selection:text-white">
      <Navbar activeSection="contact" />

      <main className="pt-44 sm:pt-48 lg:pt-52 pb-20 space-y-16">
        <Suspense fallback={<ContactPageSkeleton />}>
          <ContactDataWrapper />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
