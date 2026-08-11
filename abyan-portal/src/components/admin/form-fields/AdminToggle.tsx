import React from 'react';

export interface AdminToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  containerClassName?: string;
}

export default function AdminToggle({ label, description, checked, onChange, containerClassName = '' }: AdminToggleProps) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${containerClassName}`}>
      <div className="flex flex-col">
        <label 
          className="font-abyan-title text-xs text-slate-700 cursor-pointer select-none whitespace-nowrap"
          onClick={() => onChange(!checked)}
        >
          {label}
        </label>
        {description && (
          <span className="font-abyan-body text-[11px] text-slate-500 mt-0.5">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 p-0.5 shrink-0 cursor-pointer rounded-full border-none outline-none transition-colors duration-200 ease-in-out ${checked ? 'bg-[#10b981]' : 'bg-slate-300'}`}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${checked ? '-translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
