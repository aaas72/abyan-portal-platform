import React, { useState, useEffect } from 'react';

export interface AdminParagraphsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function AdminParagraphsInput({
  label,
  value,
  onChange,
  containerClassName = '',
  placeholder = 'اكتب نص الفقرة هنا...',
  required,
  error
}: AdminParagraphsInputProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>(['']);

  // Sync internal paragraphs when raw string value changes externally
  useEffect(() => {
    if (value !== paragraphs.join('\n\n')) {
      if (value) {
        setParagraphs(value.split('\n\n'));
      } else {
        setParagraphs(['']);
      }
    }
  }, [value]);

  const updateParagraph = (index: number, text: string) => {
    const updated = [...paragraphs];
    updated[index] = text;
    setParagraphs(updated);
    onChange(updated.join('\n\n'));
  };

  const addParagraph = () => {
    const updated = [...paragraphs, ''];
    setParagraphs(updated);
    onChange(updated.join('\n\n'));
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length <= 1) {
      setParagraphs(['']);
      onChange('');
      return;
    }
    const updated = paragraphs.filter((_, i) => i !== index);
    setParagraphs(updated);
    onChange(updated.join('\n\n'));
  };

  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value;
    onChange(rawVal);
  };

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {/* Top Header Label & Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="font-abyan-title text-[13px] text-slate-800">
          {label} {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsRawMode(!isRawMode)}
          className="text-xs font-abyan-title text-slate-500 hover:text-[#10b981] bg-transparent border-none cursor-pointer transition-colors"
        >
          {isRawMode ? "عرض كفقرات منفصلة" : "محرر كتل حر"}
        </button>
      </div>

      {/* Raw Textarea Mode */}
      {isRawMode ? (
        <textarea
          rows={6}
          value={value}
          onChange={handleRawChange}
          placeholder="اكتب السيرة أو النص الكامل... استخدم السطر الفارغ للفصل بين الفقرات"
          className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-y min-h-[140px] ${
            error ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
          }`}
        />
      ) : (
        /* Dynamic Paragraph Blocks Mode */
        <div className="space-y-3">
          {paragraphs.map((par, index) => (
            <div 
              key={index}
              className={`group relative p-3 rounded-xl border bg-slate-50/20 hover:bg-slate-50/40 transition-all space-y-1.5 shadow-none ${
                error ? 'border-red-500 focus-within:border-red-600' : 'border-slate-200 focus-within:border-[#10b981]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-abyan-title text-emerald-700">
                  الفقرة {index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="text-xs font-abyan-title text-slate-500 hover:text-[#10b981] bg-transparent border-none cursor-pointer transition-colors p-0"
                  >
                    إضافة فقرة جديدة
                  </button>
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="text-xs font-abyan-title text-slate-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors p-0"
                      title="حذف هذه الفقرة"
                    >
                      حذف الفقرة
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={3}
                value={par}
                onChange={(e) => updateParagraph(index, e.target.value)}
                placeholder={`${placeholder} (الفقرة ${index + 1})`}
                className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-y min-h-[70px] ${
                  error ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
                }`}
              />
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
    </div>
  );
}
