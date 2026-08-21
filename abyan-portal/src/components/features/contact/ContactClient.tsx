"use client";
import React from "react";
import { motion } from "framer-motion";
import { SmartContainer } from "@/components/layout";
import { SubpageHero } from "@/components/ui";
import { sectionFadeUpVariants, itemFadeInRight } from "@/lib/animations";
import { ContactInfo } from "@/types/schemas";

interface ContactClientProps {
  initialData: ContactInfo;
}

export default function ContactClient({ initialData }: ContactClientProps) {
  const hasEmailChannels = initialData.emailChannels && initialData.emailChannels.length > 0;
  const hasSimpleEmails = initialData.emails && initialData.emails.length > 0;

  const hasPhoneChannels = initialData.phoneChannels && initialData.phoneChannels.length > 0;
  const hasSimplePhones = initialData.phones && initialData.phones.length > 0;

  const emailChannels = hasEmailChannels
    ? initialData.emailChannels
    : hasSimpleEmails
    ? initialData.emails.map((email, idx) => ({
        title: idx === 0 ? "البريد الإلكتروني المباشر" : `قناة المراسلة ${idx + 1}`,
        description: "للتواصل والمراسلات المباشرة مع إدارة المنصة",
        email: email,
      }))
    : [];

  const phoneChannels = hasPhoneChannels
    ? initialData.phoneChannels
    : hasSimplePhones
    ? initialData.phones.map((phone, idx) => ({
        title: idx === 0 ? "الهاتف والواتساب المباشر" : `رقم التواصل ${idx + 1}`,
        description: "للتواصل والمحادثات المباشرة مع إدارة المنصة",
        phone: phone,
      }))
    : [];

  const isEmpty = emailChannels.length === 0 && phoneChannels.length === 0;

  return (
    <>
      <SubpageHero
        tag="قنوات التواصل والتوثيق"
        titlePrefix="معلومات"
        titleHighlight="التواصل والمشاركة"
        description="نرحب بتواصلكم واستفساراتكم، ونسعد بمشاركتكم الفاعلة في صون وتوثيق الإرث الحضاري لمحافظة أبين."
      />

      <SmartContainer className="max-w-5xl py-8 sm:py-12">
        {isEmpty ? (
          <div className="text-center py-16 space-y-3">
            <h3 className="font-abyan-title text-xl text-slate-800 font-normal">
              لا توجد بيانات تواصل منشورة حالياً
            </h3>
            <p className="font-abyan-body text-slate-500 text-sm">
              سيتم تحديث قنوات التواصل المباشرة قريباً.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* SPECIALIZED EMAIL CHANNELS SECTION */}
            {emailChannels.length > 0 && (
              <div className="space-y-6 text-right">
                <motion.div {...sectionFadeUpVariants} className="space-y-1">
                  <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                    قنوات المراسلة الإلكترونية
                  </span>
                  <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                    البريد الإلكتروني المخصص حسب نوع التواصل
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {emailChannels.map((channel, idx) => (
                    <motion.div
                      key={idx}
                      {...itemFadeInRight(idx * 0.08)}
                      className="bg-transparent border-none shadow-none space-y-2.5 text-right flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <h3 className="text-base md:text-lg font-abyan-title text-slate-900 font-normal leading-snug">
                          {channel.title}
                        </h3>
                        {channel.description && (
                          <p className="text-slate-600 font-abyan-body text-sm leading-relaxed">
                            {channel.description}
                          </p>
                        )}
                      </div>
                      <div className="pt-2">
                        <a
                          href={`mailto:${channel.email}`}
                          className="text-sky-600 font-abyan-body text-base sm:text-lg font-normal hover:text-[#10b981] transition-colors break-all inline-block"
                          dir="ltr"
                        >
                          {channel.email}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* PHONE & DIRECT CONTACT SECTION */}
            {phoneChannels.length > 0 && (
              <div className="pt-8 border-t border-slate-100 text-right space-y-6">
                <motion.div {...sectionFadeUpVariants} className="space-y-1">
                  <span className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block">
                    التواصل الهاتفي والمباشر
                  </span>
                  <h2 className="font-abyan-title text-2xl sm:text-3xl text-slate-900 font-normal">
                    أرقام الهاتف وواتساب المخصصة
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {phoneChannels.map((channel, idx) => (
                    <motion.div
                      key={idx}
                      {...itemFadeInRight(idx * 0.08)}
                      className="bg-transparent border-none shadow-none space-y-2.5 text-right flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <h3 className="text-base md:text-lg font-abyan-title text-slate-900 font-normal leading-snug">
                          {channel.title}
                        </h3>
                        {channel.description && (
                          <p className="text-slate-600 font-abyan-body text-sm leading-relaxed">
                            {channel.description}
                          </p>
                        )}
                      </div>
                      <div className="pt-2">
                        <a
                          href={`tel:${channel.phone}`}
                          className="text-sky-600 font-abyan-body text-base sm:text-lg font-normal hover:text-[#10b981] transition-colors break-all inline-block"
                          dir="ltr"
                        >
                          {channel.phone}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SmartContainer>
    </>
  );
}
