"use client";

import React from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader 
        title="إعدادات المنصة" 
        description="تخصيص وتعديل إعدادات النظام ومعلومات المنصة الأساسية."
      />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 mt-6 min-h-[400px] flex items-center justify-center">
        <p className="font-abyan-body text-slate-500 text-center">
          صفحة الإعدادات قيد التطوير حالياً، سيتم إضافة خيارات التخصيص قريباً.
        </p>
      </div>
    </div>
  );
}
