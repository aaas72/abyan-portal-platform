"use client";
import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero } from "@/components/ui";
import { itemFadeInRight } from "@/lib/animations";
import { ContactInfo } from "@/types/schemas";

interface ContactClientProps {
  initialData: ContactInfo;
}

export default function ContactClient({ initialData }: ContactClientProps) {
  return (
    <>
      <SubpageHero
        tag="التواصل معنا"
        titlePrefix="معلومات"
        titleHighlight="الاتصال"
        description="نرحب بتواصلكم واستفساراتكم، ونسعد بمشاركتكم في إثراء المنصة الثقافية."
      />

      <SmartContainer className="max-w-4xl py-12">
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          
          <motion.div
            {...itemFadeInRight(0.1)}
            className="flex flex-col items-center justify-start text-center"
          >
            <h3 className="text-xl md:text-2xl font-abyan-title text-slate-900 font-normal mb-3">
              رقم الهاتف
            </h3>
            <p className="text-slate-600 font-abyan-body text-sm md:text-base mb-4">
              يمكنكم التواصل معنا عبر الهاتف أو واتساب
            </p>
            <div className="flex flex-col gap-2 items-center">
              {initialData.phones && initialData.phones.length > 0 ? (
                initialData.phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${phone}`} className="text-[#10b981] font-abyan-body text-xl font-normal hover:text-sky-600 transition-colors" dir="ltr">
                    {phone}
                  </a>
                ))
              ) : (
                <span className="text-slate-400 font-abyan-body text-sm">لا توجد أرقام متاحة حالياً</span>
              )}
            </div>
          </motion.div>

          <motion.div
            {...itemFadeInRight(0.2)}
            className="flex flex-col items-center justify-start text-center"
          >
            <h3 className="text-xl md:text-2xl font-abyan-title text-slate-900 font-normal mb-3">
              البريد الإلكتروني
            </h3>
            <p className="text-slate-600 font-abyan-body text-sm md:text-base mb-4">
              للمراسلات الرسمية وإرسال الوثائق والمقالات
            </p>
            <div className="flex flex-col gap-2 items-center">
              {initialData.emails && initialData.emails.length > 0 ? (
                initialData.emails.map((email, idx) => (
                  <a key={idx} href={`mailto:${email}`} className="text-[#10b981] font-abyan-body text-xl font-normal hover:text-sky-600 transition-colors" dir="ltr">
                    {email}
                  </a>
                ))
              ) : (
                <span className="text-slate-400 font-abyan-body text-sm">لا يوجد بريد متاح حالياً</span>
              )}
            </div>
          </motion.div>

        </div>
      </SmartContainer>
    </>
  );
}
