"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { ContentSource } from "@/types/schemas";

export interface FoodCardData {
  id: string;
  title: string;
  tag: string;
  location: string;
  description: string;
  authorName?: string;
  sourceName?: string;
  sourceUrl?: string;
  sources?: ContentSource[];
  bgGradient?: string;
  images?: string[];
}

interface FoodCardProps {
  foodCard: FoodCardData;
  onClick: () => void;
}

export default function FoodCard({ foodCard, onClick }: FoodCardProps) {
  const tagText = foodCard.tag ? foodCard.tag.split("•")[0].trim() : undefined;

  return (
    <motion.div
      onClick={onClick}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group cursor-pointer text-right bg-gradient-to-br from-emerald-100/70 via-white to-sky-100/70 hover:from-sky-100/90 hover:to-emerald-100/90 transition-all duration-500 ease-in-out rounded-2xl p-4 border-none space-y-3 shadow-none overflow-hidden w-full relative"
    >
      {/* Square Food Photo Box */}
      <div
        className={`w-full aspect-square rounded-xl overflow-hidden relative ${
          !foodCard.images?.[0] ? "bg-gradient-to-br " + foodCard.bgGradient : "bg-slate-100"
        } flex flex-col justify-between text-white shadow-inner`}
      >
        {foodCard.images?.[0] ? (
          <Image 
            src={foodCard.images[0]}
            alt={foodCard.title}
            fill
            className="object-cover transition-transform duration-500 pointer-events-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : null}
      </div>

      {/* Title & Short Description */}
      <div className="space-y-1 overflow-hidden">
        {tagText && (
          <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block overflow-hidden truncate">
            {tagText}
          </span>
        )}
        <h3 className="font-abyan-title text-base sm:text-lg font-normal leading-snug text-slate-900 group-hover:text-sky-600 transition-colors overflow-hidden break-words">
          {foodCard.title}
        </h3>
        {foodCard.location && (
          <span className="text-sm sm:text-base font-normal text-sky-700 font-abyan-title block break-words leading-snug">
            {foodCard.location}
          </span>
        )}
        <p className="text-base sm:text-lg text-slate-700 font-abyan-body font-normal line-clamp-2 leading-relaxed overflow-hidden">
          {foodCard.description}
        </p>
      </div>

      {/* Prompt Link */}
      <div className="pt-1 text-left text-sm text-sky-600 font-abyan-title border-none">
        <span className="group-hover:translate-x-[-3px] transition-transform font-normal inline-block">
          معاينة ←
        </span>
      </div>
    </motion.div>
  );
}
