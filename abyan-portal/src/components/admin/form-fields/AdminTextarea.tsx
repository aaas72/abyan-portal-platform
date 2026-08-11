import React from 'react';

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  containerClassName?: string;
  error?: string;
}

export default function AdminTextarea({ label, containerClassName = '', error, ...props }: AdminTextareaProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex justify-between items-center">
        <label className="font-abyan-title text-[13px] text-slate-800">
          {label} {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
        {props.maxLength && (
          <span className="text-xs text-slate-400 font-abyan-body">
            {String(props.value || '').length} / {props.maxLength}
          </span>
        )}
      </div>
      <textarea 
        className={`w-full px-3 py-1.5 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-sm text-slate-900 placeholder:text-slate-400 resize-none ${
          error ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
    </div>
  );
}
