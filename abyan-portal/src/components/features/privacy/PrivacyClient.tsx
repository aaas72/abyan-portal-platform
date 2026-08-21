"use client";

import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, EmptyState } from "@/components/ui";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";
import { PrivacyItem } from "@/types/schemas";
import RichTextRenderer from "@/components/ui/RichTextRenderer";

interface PrivacyClientProps {
  intro: PrivacyItem[];
  dataCollection: PrivacyItem[];
  usageAndProtection: PrivacyItem[];
  cookiesAndAnalytics: PrivacyItem[];
}

export default function PrivacyClient({
  intro,
  dataCollection,
  usageAndProtection,
  cookiesAndAnalytics,
}: PrivacyClientProps) {
  const isEmpty =
    (!intro || intro.length === 0) &&
    (!dataCollection || dataCollection.length === 0) &&
    (!usageAndProtection || usageAndProtection.length === 0) &&
    (!cookiesAndAnalytics || cookiesAndAnalytics.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title="لا توجد سياسة مضافة بعد"
        message="لم يتم إضافة أي بنود لسياسة الخصوصية حتى الآن. سيتم التحديث قريباً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="بيان الأمان والخصوصية"
        titlePrefix="سياسة الخصوصية"
        titleHighlight="وحماية البيانات"
        description={
          'نلتزم في بوابة أبين الثقافية بحماية خصوصية كافة الزوار والباحثين والمساهمين، وتوضيح إجراءات الأمان الرقمي التي نتبعها لصون البيانات المحدودة المقدمة طوعاً للمشروع.'
        }
      />

      {/* SECTION 1: INTRO & PRINCIPLES */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          <motion.div
            {...sectionFadeUpVariants}
            className="py-2 sm:py-4 space-y-4 text-right"
          >
            <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
              الالتزام الأخلاقي
            </span>
            <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal leading-snug">
              حماية بيانات الزوار <span className="text-sky-600">والنزاهة في التعامل الرقمي</span>
            </h2>
            {intro && intro.length > 0 && (
              <div className="space-y-4 pt-1">
                {intro.map((item, idx) => (
                  <div key={item._id || idx} className="space-y-2">
                    <h3 className="font-abyan-title text-base md:text-lg text-slate-900 font-normal">
                      {item.title}
                    </h3>
                    <RichTextRenderer content={item.description} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* SECTION 2: DATA COLLECTION */}
          {dataCollection && dataCollection.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  جمع البيانات
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  طبيعة البيانات التي نتعامل معها
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {dataCollection.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    {...itemFadeInRight(idx * 0.08)}
                    className="bg-transparent border-none shadow-none space-y-2 text-right"
                  >
                    <h3 className="font-abyan-title text-base md:text-lg text-slate-900 font-normal">
                      {item.title}
                    </h3>
                    <RichTextRenderer content={item.description} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: USAGE & PROTECTION */}
          {usageAndProtection && usageAndProtection.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  الحماية والضمان
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  بروتوكولات الأمان وعدم مشاركة البيانات
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {usageAndProtection.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    {...itemFadeInRight(idx * 0.08)}
                    className="bg-transparent border-none shadow-none space-y-2 text-right"
                  >
                    <h3 className="font-abyan-title text-base md:text-lg text-slate-900 font-normal">
                      {item.title}
                    </h3>
                    <RichTextRenderer content={item.description} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: COOKIES & ANALYTICS */}
          {cookiesAndAnalytics && cookiesAndAnalytics.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  التحليلات وحقوق المستخدم
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  ملفات تعريف الارتباط وحق طلب الحذف
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {cookiesAndAnalytics.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    {...itemFadeInRight(idx * 0.08)}
                    className="bg-transparent border-none shadow-none space-y-2 text-right"
                  >
                    <h3 className="font-abyan-title text-base md:text-lg text-slate-900 font-normal">
                      {item.title}
                    </h3>
                    <RichTextRenderer content={item.description} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SmartContainer>
    </>
  );
}
