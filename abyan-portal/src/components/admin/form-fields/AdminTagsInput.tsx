import React, { useState } from 'react';

export interface AdminTagsInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  containerClassName?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function AdminTagsInput({ label, tags, onChange, containerClassName = '', required, error, placeholder = "اضغط Enter لإضافة عنصر جديد..." }: AdminTagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label className="font-abyan-title text-[13px] text-slate-800">
        {label} {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-sm text-slate-900 placeholder:text-slate-400 ${
          error ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
        }`}
      />
      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
      {tags.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 px-1">
          {tags.map((tag, idx) => (
            <li key={idx} className="flex items-start gap-2 group">
              <span className="text-slate-300 mt-0.5 shrink-0">•</span>
              <span className="text-sky-600 text-[13px] font-abyan-body flex-1 leading-relaxed">
                {tag}
              </span>
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="text-slate-400 hover:text-red-500 transition-colors outline-none text-lg leading-none shrink-0"
                title="حذف"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
