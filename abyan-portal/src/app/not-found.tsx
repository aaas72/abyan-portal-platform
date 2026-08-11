"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { sectionFadeUpVariants, subtleMicroHover } from "@/lib/animations";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#10b981] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#0ea5e9] rounded-full blur-[100px]" />
      </div>

      <SmartContainer className="text-center relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={sectionFadeUpVariants.initial}
          animate={sectionFadeUpVariants.whileInView}
          transition={sectionFadeUpVariants.transition}
          className="space-y-6"
        >
          {/* Subtitle */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-abyan-title text-slate-900 font-normal">
              عذراً، لم نتمكن من العثور على هذه الصفحة
            </h2>
            <p className="text-xs sm:text-sm text-[#1e293b] font-abyan-body max-w-lg mx-auto leading-relaxed">
              يبدو أن الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها. يمكنك العودة إلى الصفحة الرئيسية لاستكشاف روائع بوابة أبين الثقافية.
            </p>
          </div>

          {/* Action Link */}
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-abyan-title text-base transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </motion.div>
      </SmartContainer>
    </div>
  );
}
