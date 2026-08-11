"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export default function AdminPageHeader({
  title,
  description,
}: AdminPageHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 lg:-mt-5 min-h-[84px] py-3 sm:py-0 shrink-0 bg-white/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 px-4 sm:px-6 lg:px-10 -mx-4 sm:-mx-6 lg:-mx-10 border-b border-slate-200">
      <div className="flex-1 min-w-0">
        <h1 className="font-abyan-title text-xl sm:text-2xl text-slate-900 font-normal leading-none m-0">
          {title}
        </h1>
        {description && (
          <p className="font-abyan-body text-sm text-slate-500 mt-2 m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
