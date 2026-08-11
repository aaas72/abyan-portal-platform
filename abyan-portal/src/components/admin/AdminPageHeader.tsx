"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export default function AdminPageHeader({
  title,
  description
}: AdminPageHeaderProps) {
  const { user } = useAuth();
  
  return (
    <div className="sticky top-0 z-40 -mt-5 h-[84px] shrink-0 bg-white/80 backdrop-blur-xl flex items-center justify-between mb-4 px-10 -mx-10 border-b border-slate-200">
      <div>
        <h3 className="font-abyan-title text-base sm:text-lg text-slate-900 font-normal leading-none">
          {title}
        </h3>
        {description && (
          <p className="font-abyan-body text-xs sm:text-sm text-slate-500 mt-2">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r border-slate-200 pr-6">

          <div className="flex flex-col justify-center text-right">
            <p className="font-abyan-title font-normal text-sm text-slate-900 leading-none">
              {user?.name || 'مستخدم النظام'}
            </p>
            <p className="font-abyan-body text-[11px] text-[#10b981] leading-none -mt-0.5">
              {user?.role === 'admin' ? 'مدير النظام' : 'كاتب محتوى'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
