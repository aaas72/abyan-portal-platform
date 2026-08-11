"use client";

import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero, EmptyState } from "@/components/ui";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";

interface AboutPillar {
  title: string;
  description: string;
}
interface AboutValue {
  title: string;
  description: string;
}
interface AboutScope {
  title: string;
  summary: string;
  items: string[];
}
interface AboutStat {
  number: string;
  label: string;
}

interface AboutClientProps {
  pillars: AboutPillar[];
  values: AboutValue[];
  scopes: AboutScope[];
  stats: AboutStat[];
}

export default function AboutClient({
  pillars,
  values,
  scopes,
  stats,
}: AboutClientProps) {
  const isEmpty =
    (!pillars || pillars.length === 0) &&
    (!values || values.length === 0) &&
    (!scopes || scopes.length === 0) &&
    (!stats || stats.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        title="لا توجد بيانات متاحة"
        message="لم يتم إضافة أي بيانات في هذا القسم حتى الآن. سيتم تحديث المحتوى قريباً."
      />
    );
  }

  return (
    <>
      {/* REUSABLE SUBPAGE HERO HEADER */}
      <SubpageHero
        tag="عن بوابة أبين الثقافية"
        titlePrefix="رؤية ورسالة بوابة"
        titleHighlight="أبين الثقافية"
        description={
          'تُمثل "بوابة أبين الثقافية" الذاكرة الحية والمرجع الرقمي الأوسع لتوثيق الإرث الحضاري لمحافظة أبين. منصة مستقلة وشاملة تأخذ على عاتقها صون الهوية المتجذرة لهذه المحافظة الاستثنائية، وعكس تنوعها الجغرافي والثقافي لمديرياتها الإحدى عشرة. نسعى من خلال هذا الصرح إلى ربط الأجيال الحاضرة والمستقبلية بأمجاد الماضي، وتسليط الضوء على إسهامات أبين المحورية في صياغة التاريخ، والسياسة، والزراعة، والأدب، والفن في اليمن وشبه الجزيرة العربية.'
        }
      />
          {/* SECTION 1: VISION & STATS COUNTERS */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-10 text-right">
          {/* Vision & Mission Summary */}
          <motion.div
            {...sectionFadeUpVariants}
            className="py-2 sm:py-4 space-y-4 text-right"
          >
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              الرؤية والعدالة التوثيقية
            </span>
            <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal leading-snug">
              صرح وثائقي يجسد تنوع{" "}
              <span className="text-sky-600">كافة مديريات أبين الـ 11</span>{" "}
              بالتساوي والأصالة
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
              أُسست البوابة لتكون أرشيفاً موثوقاً وسجلاً وطنياً شاملاً يتجاوز
              المركزية، ليمنح كل مساحة من جغرافية أبين حقها من التوثيق. من شواطئ
              أحور وزنجبار وشقرة، مروراً بدلتا الفن والزراعة في خنفر والوضيع
              ومودية، وصولاً إلى حصون التاريخ وشموخ الجبال في لودر، المحفد،
              جيشان، سرار، رصد، وسباح. إنها رحلة في عمق الجغرافيا والتاريخ لنبش
              كنوز المحافظة.
            </p>
          </motion.div>

          {/* Portal Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2 border-t border-slate-100">
            {(stats || []).slice(0, 15).map((st, idx) => (
              <motion.div
                key={idx}
                {...itemFadeInRight(idx * 0.06)}
                className="p-4 bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 rounded-2xl text-center space-y-1"
              >
                <span className="font-abyan-title text-2xl sm:text-3xl font-normal text-sky-600 block">
                  {st.number}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 font-abyan-title font-normal block leading-tight">
                  {st.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 2: STRATEGIC PILLARS */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              الهيكلية والتأثيث
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              الأهداف والأركان الاستراتيجية للمشروع
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(pillars || []).slice(0, 15).map((pillar, idx) => (
              <motion.div
                key={idx}
                {...itemFadeInRight(idx * 0.08)}
                className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 rounded-2xl border-none shadow-none space-y-2 text-right hover:from-emerald-100 hover:to-sky-100 transition-all duration-300"
              >
                <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 3: SCOPE OF ARCHIVAL DOCUMENTATION */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              تغطية التوثيق
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              مجالات التوثيق والأرشفة بالمنصة
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(scopes || []).slice(0, 15).map((sc, idx) => (
              <motion.div
                key={idx}
                {...itemFadeInRight(idx * 0.1)}
                className="p-5 bg-white rounded-2xl space-y-3 text-right"
              >
                <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal leading-snug">
                  {sc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1e293b] font-abyan-body font-normal leading-relaxed">
                  {sc.summary}
                </p>
                <ul className="space-y-2 list-none p-0 m-0 pt-2 border-t border-slate-100">
                  {sc.items?.map((it, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-xs sm:text-sm text-sky-600 font-abyan-body font-semibold leading-relaxed"
                    >
                      • {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>

      {/* SECTION 4: CORE VALUES & METHODOLOGY */}
      <SmartContainer>
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          <div className="space-y-1">
            <span className="text-xs font-normal text-[#10b981] font-abyan-title block">
              المرجعية الوطنية
            </span>
            <h2 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal">
              القيم والمبادئ والمنهجية
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(values || []).slice(0, 15).map((val, idx) => (
              <motion.div
                key={idx}
                {...itemFadeInRight(idx * 0.08)}
                className="p-5 sm:p-6 bg-slate-50/60 rounded-2xl space-y-2 text-right"
              >
                <h3 className="font-abyan-title text-base text-slate-900 font-normal">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-abyan-body font-normal leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </SmartContainer>
    </>
  );
}