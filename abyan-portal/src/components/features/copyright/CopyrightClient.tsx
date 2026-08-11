"use client";

import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, EmptyState } from "@/components/ui";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";
import { CopyrightItem } from "@/types/schemas";

interface CopyrightClientProps {
  declarations: CopyrightItem[];
  pillars: CopyrightItem[];
  guidelines: CopyrightItem[];
  contactNotice: CopyrightItem[];
}

export default function CopyrightClient({
  declarations,
  pillars,
  guidelines,
  contactNotice,
}: CopyrightClientProps) {
  const isEmpty =
    (!declarations || declarations.length === 0) &&
    (!pillars || pillars.length === 0) &&
    (!guidelines || guidelines.length === 0) &&
    (!contactNotice || contactNotice.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title="لا توجد سياسات مضافة بعد"
        message="لم يتم إضافة أي بنود لحقوق الملكية الفكرية حتى الآن. سيتم التحديث قريباً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="سياسة الملكية الفكرية والأرشيف"
        titlePrefix="حقوق الملكية الفكرية والنشر"
        titleHighlight="للكتّاب والباحثين"
        description={
          'تُمثل "بوابة أبين الثقافية" مكتبة توثيقية وأرشيفاً وطنياً غير تجاري لصون وتخليد الإرث الحضاري لمحافظة أبين. ونؤكد هنا بصراحة جازمة أن كافة الحقوق الأدبية والفكرية للمواد المعروضة بالمنصة محفوظة كلياً وبصورة كاملة لمؤلفيها، وباحثيها، ورُواتها، والورثة الشرعيين لحقوقهم.'
        }
      />

      {/* SECTION 1: EXPLICIT IP OWNERSHIP DECLARATION */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          <motion.div
            {...sectionFadeUpVariants}
            className="py-2 sm:py-4 space-y-4 text-right"
          >
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              إعلان الملكية الأصلي
            </span>
            <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal leading-snug">
              الحقوق الأدبية والفكرية <span className="text-sky-600">ملكٌ حصري لكتّابها ومؤلفيها</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
              إن منصة بوابة أبين الثقافية هي جهة توثيق وأرشفة وإبراز للتراث الثقافي وليست مالكة للحقوق الفكرية أو الأدبية للأبحاث والمؤلفات والسير الوثائقية المعروضة فيها. يظل كل كاتب وباحث ومؤرخ وصاحب أثرٍ أدبي هو المالك الأصلي والوحيد لإنتاجه الفكري والمعنوي، وتلتزم المنصة بإبراز اسمه ونسب المادة إليه بدقة وأصالة.
            </p>
          </motion.div>

          {/* Declarations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
            {(declarations || []).slice(0, 15).map((item, idx) => (
              <motion.div
                key={item._id || idx}
                {...itemFadeInRight(idx * 0.08)}
                className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 rounded-2xl border-none shadow-none space-y-2 text-right"
              >
                <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 2: ARCHIVAL METHODOLOGY PILLARS */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              المرجعية الوطنية
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              ركائز المنهجية التوثيقية والأمانة العلمية
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(pillars || []).slice(0, 15).map((item, idx) => (
              <motion.div
                key={item._id || idx}
                {...itemFadeInRight(idx * 0.1)}
                className="p-5 bg-white rounded-2xl space-y-3 text-right"
              >
                <span className="text-xs font-normal text-sky-600 font-abyan-title block">
                  ركن توثيقي
                </span>
                <h3 className="font-abyan-title text-base text-slate-900 font-normal leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 3: CITATION & USAGE GUIDELINES */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              ضوابط النقل والبحث
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              شروط اقتباس ونقل المحتوى للباحثين والإعلام
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(guidelines || []).slice(0, 15).map((item, idx) => (
              <motion.div
                key={item._id || idx}
                {...itemFadeInRight(idx * 0.08)}
                className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-2 text-right"
              >
                <h3 className="font-abyan-title text-base text-slate-900 font-normal">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 4: NOTICE & TAKEDOWN / CONTACT PROCESS */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              التواصل والتحديث
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              آلية طلب التنسيب والتعديل أو الحذف
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(contactNotice || []).slice(0, 15).map((item, idx) => (
              <motion.div
                key={item._id || idx}
                {...itemFadeInRight(idx * 0.08)}
                className="p-6 bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 rounded-2xl space-y-3 text-right"
              >
                <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-abyan-body font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>
    </>
  );
}
