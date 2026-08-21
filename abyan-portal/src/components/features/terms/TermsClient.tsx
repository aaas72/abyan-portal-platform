"use client";

import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, EmptyState } from "@/components/ui";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";
import { TermsItem } from "@/types/schemas";
import RichTextRenderer from "@/components/ui/RichTextRenderer";

interface TermsClientProps {
  intro: TermsItem[];
  usageRules: TermsItem[];
  intellectualProperty: TermsItem[];
  disclaimer: TermsItem[];
}

export default function TermsClient({
  intro,
  usageRules,
  intellectualProperty,
  disclaimer,
}: TermsClientProps) {
  const isEmpty =
    (!intro || intro.length === 0) &&
    (!usageRules || usageRules.length === 0) &&
    (!intellectualProperty || intellectualProperty.length === 0) &&
    (!disclaimer || disclaimer.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title="لا توجد شروط مضافة بعد"
        message="لم يتم إضافة أي بنود لشروط الاستخدام حتى الآن. سيتم التحديث قريباً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="وثيقة الشروط والأحكام"
        titlePrefix="شروط وأحكام"
        titleHighlight="استخدام المنصة"
        description={
          'تنظم هذه الوثيقة ضوابط الاستخدام والتصفح لبوابة أبين الثقافية، وتوضح حقوق وواجبات الباحثين والزوار والمساهمين بما يضمن صون الأمانة العلمية ونقاء الهدف المعرفي غير التجاري للمشروع.'
        }
      />

      {/* SECTION 1: INTRO & ACCEPTANCE */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          <motion.div
            {...sectionFadeUpVariants}
            className="py-2 sm:py-4 space-y-4 text-right"
          >
            <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
              القبول بالشروط
            </span>
            <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal leading-snug">
              المعايير المنهجية <span className="text-sky-600">والاستخدام الواعي للأرشيف</span>
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

          {/* SECTION 2: USAGE RULES */}
          {usageRules && usageRules.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  ضوابط التصفح
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  قواعد الاستخدام والنزاهة المعرفية
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {usageRules.map((item, idx) => (
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

          {/* SECTION 3: IP & BRANDING */}
          {intellectualProperty && intellectualProperty.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  الملكية والهوية
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  حقوق المصنفات والهوية الرقمية للبوابة
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {intellectualProperty.map((item, idx) => (
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

          {/* SECTION 4: DISCLAIMER & UPDATES */}
          {disclaimer && disclaimer.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-100 text-right">
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                  المسؤولية والتحديث
                </span>
                <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                  حدود المسؤولية وإخلاء الطرف القانوني
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {disclaimer.map((item, idx) => (
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
