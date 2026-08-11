"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";
import { AdminLandingSection } from "@/types/admin.types";

export default function Hero({ data }: { data?: AdminLandingSection }) {
  const [currentDateString, setCurrentDateString] = useState<string>("");

  useEffect(() => {
    // تنسيق التاريخ واليوم بالصيغة العربية
    const now = new Date();
    const formattedDate = now.toLocaleDateString("ar-YE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDateString(formattedDate);
  }, []);

  const title =
    data?.title || "الأَرْضُ المِعْطَاءُ وَأَصَالَةُ التَّارِيخِ وَالوَجْدَانِ";
  const subtitle =
    data?.subtitle ||
    "بوابة ثقافية وتوثيقية شاملة تصحبك في رحلة عبر تاريخ، إنسان، ومعالم محافظة أبين";

  const defaultImage =
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80";
  const images = data?.images && data.images.length > 0 ? data.images : [defaultImage];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // تغيير الصورة كل 5 ثواني
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="w-full h-screen h-[100dvh] p-2 sm:p-4 lg:p-5 bg-gradient-to-br from-emerald-100/100 via-white to-sky-100/100 border-none shadow-none relative overflow-hidden flex flex-col box-border">
      {/* Framed Canvas - Margin Frame with Rounded Image */}
      <motion.div
        {...sectionFadeUpVariants}
        className="relative w-full h-full rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] overflow-hidden border-none shadow-none flex-1 group bg-slate-950"
      >
        {/* Background Image Slider */}
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="صورة خلفية أبين"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Light Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/20 to-slate-950/20"></div>

        {/* Centered Slogan Text */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 sm:p-10 lg:p-12 max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <motion.h1
            {...itemFadeInRight(0.2)}
            className="font-abyan-title text-3xl sm:text-4xl lg:text-5xl text-white drop-shadow-md leading-relaxed font-normal"
          >
            {title}
          </motion.h1>

          <motion.div
            {...itemFadeInRight(0.35)}
            className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal drop-shadow-sm leading-relaxed block"
            style={{
              fontFamily: "ThmanyahSerifRegular, serif",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {subtitle}
          </motion.div>
        </div>

        {/* Bottom Left: Pure Plain Text Date */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 z-20">
          <motion.div
            {...itemFadeInRight(0.35)}
            className="font-abyan-title text-sky-400 text-xs sm:text-sm lg:text-base drop-shadow-md tracking-wide font-normal"
            style={{ color: "#38bdf8" }}
          >
            {currentDateString || "الخميس، 6 أغسطس 2026"}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
