"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";

export default function Footer() {
  const footerLinks = [
    { label: "التاريخ والحضارات", href: "/history" },
    { label: "الثقافة والتراث", href: "/culture" },
    { label: "دليل المديريات", href: "/districts" },
    { label: "المعالم والأطواد", href: "/landmarks" },
    { label: "الاقتصاد والثروات", href: "/economy" },
    { label: "الأعلام والرواد", href: "/pioneers" },
    { label: "الأرشيف والوثائق", href: "/gallery" },
    { label: "عن البوابة", href: "/about" },
    { label: "حقوق الملكية الفكرية", href: "/copyright" },
  ];

  // روابط لفئات عشوائية من قاعدة البيانات
  const randomCategories = [
    { label: "حصون وقلاع", href: "/landmarks" },
    { label: "مساجد تاريخية", href: "/landmarks" },
    { label: "شعراء", href: "/pioneers" },
    { label: "أكلات شعبية", href: "/culture" },
    { label: "الزراعة", href: "/economy" },
  ];

  return (
    <footer className="w-full bg-white p-4 sm:p-6 lg:p-8 border-none shadow-none flex flex-col gap-4">
      {/* اللوحة المُأطَّرة بخلفية خضراء — نفس أسلوب الهيرو */}
      <motion.div
        {...sectionFadeUpVariants}
        className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#10b981] px-6 sm:px-10 lg:px-16 py-10 sm:py-14 flex flex-col gap-8"
      >
        {/* طبقة تدرج خفيف لإضفاء العمق كما في الهيرو */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/80 via-[#10b981] to-[#047857]/90 pointer-events-none" />

        {/* المحتوى فوق التدرج */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* الشعار والوصف مع دعوة المشاركة */}
          <motion.div {...itemFadeInRight(0.1)} className="w-full flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-1">
              <h3 className="font-abyan-title text-2xl md:text-3xl lg:text-4xl text-white font-normal leading-snug drop-shadow-md">
                بوابة أَبيَن الثقافية
              </h3>
              <p className="text-sm md:text-base text-white/90 font-abyan-body font-normal leading-relaxed">
                منصة توثيق التراث، الحضارة، والجغرافيا الأبينية العريقة
              </p>
            </div>
            
            <div className="text-right md:text-left">
              <p className="text-base md:text-lg text-white/90 font-abyan-body font-normal leading-relaxed">
                إن كنت تعرف عن أبين وتريد المشاركة في الكتابة، <Link href="/contact" className="text-white font-abyan-title hover:text-sky-200 transition-colors cursor-pointer mr-1 no-underline">تواصل معنا</Link>
              </p>
            </div>
          </motion.div>

          {/* شريط الروابط المتحرك (Marquee) يتحرك ببطء لليسار */}
          <div className="overflow-hidden border-t border-white/20 pt-6 mt-6 relative w-full" dir="rtl">
            <motion.div
              animate={{ x: ["25%", "0%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25,
              }}
              className="flex flex-row flex-nowrap w-max items-center gap-x-8"
            >
              {/* نقوم بتكرار الروابط 4 مرات لضمان عدم ظهور أي فراغ حتى في الشاشات العريضة جداً */}
              {[...footerLinks, ...randomCategories, ...footerLinks, ...randomCategories, ...footerLinks, ...randomCategories, ...footerLinks, ...randomCategories].map((item, idx) => (
                <Link
                  key={`marquee-${idx}`}
                  href={item.href}
                  className="text-sm md:text-base text-white hover:text-sky-200 font-abyan-title font-normal transition-colors no-underline whitespace-nowrap shrink-0"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* حقوق النشر والروابط الهامة في أقصى أسفل المكون خارج اللوحة الخضراء */}
      <div className="px-2 sm:px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600 font-abyan-body font-normal text-center md:text-right">
          جميع الحقوق محفوظة © {new Date().getFullYear()} بوابة أبين الثقافية
        </p>
        <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-abyan-title font-normal">
          <Link href="/about" className="hover:text-[#10b981] transition-colors">عن المنصة</Link>
          <Link href="/terms" className="hover:text-[#10b981] transition-colors">شروط الاستخدام</Link>
          <Link href="/privacy" className="hover:text-[#10b981] transition-colors">سياسة الخصوصية</Link>
          <Link href="/contact" className="hover:text-[#10b981] transition-colors">اتصل بنا</Link>
        </div>
      </div>
    </footer>
  );
}
