"use client";

import React from "react";
import { DistrictItem } from "@/types/schemas";
import { motion } from "framer-motion";
import { UNIFIED_EASING } from "@/lib/animations";

interface DistrictHeroProps {
  district: DistrictItem;
}

export default function DistrictHero({ district }: DistrictHeroProps) {
  // تدرج الخلفية الأساسي للمكون (يظهر كإطار أو في حال عدم وجود صورة)
  const identityGradient =
    "bg-gradient-to-l from-emerald-900 via-slate-900 to-sky-900";
    
  return (
    <div
      className={`relative w-full h-auto min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] rounded-3xl overflow-hidden mb-6 flex items-start ${identityGradient}`}
    >
      <div className="absolute inset-1.5 sm:inset-2 rounded-[1.25rem] overflow-hidden pointer-events-none">
        {district.images && district.images.length > 0 && (
          <>
            <motion.img
              initial={{ scale: 1.15, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: UNIFIED_EASING }}
              src={district.images[0]}
              alt={`مديرية ${district.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </>
        )}
      </div>

      {/* التدرج اللوني والنقاط كخلفية في حال عدم وجود صورة أو حول الحواف */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/95 via-slate-900/70 to-sky-950/30" />
        {(!district.images || district.images.length === 0) && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
      </div>

      <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col gap-4 text-right">
        <div className="space-y-1.5 flex flex-col">
          <h2 className="font-abyan-title text-3xl sm:text-4xl text-white font-normal leading-snug">
            مديرية {district.name}
          </h2>
          <span className="text-sm sm:text-base font-normal text-emerald-400 font-abyan-body">
            {district.title}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-normal font-abyan-body">
            <span className="text-emerald-400">المركز الإداري:</span>
            <span className="text-white">{district.capital}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-normal font-abyan-body">
            <span className="text-sky-400">المساحة الجغرافية:</span>
            <span className="flex items-center gap-1">
              <span className="text-white">{district.areaKm2} كم²</span>
              <span className="text-slate-300 text-xs">
                ({district.areaPercentage})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
