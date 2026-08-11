import React from "react";

export interface AdminTab<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface AdminTabsProps<T extends string = string> {
  tabs: AdminTab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  actionLabel,
  onAction,
}: AdminTabsProps<T>) {
  
  return (
    <div className="sticky top-[84px] h-[44px] shrink-0 z-30 bg-white/90 backdrop-blur-xl flex items-center justify-between gap-4 -mt-4 mb-6 px-10 -mx-10 pt-2 border-b border-slate-200">
      <div className="flex items-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-2 px-2 font-abyan-title text-sm transition-colors cursor-pointer ${
            activeTab === tab.id
              ? 'text-sky-600'
              : 'text-slate-500 hover:text-sky-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
      </div>
      
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="font-abyan-title text-base text-slate-800 hover:text-[#10b981] transition-colors bg-transparent border-none cursor-pointer pb-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
