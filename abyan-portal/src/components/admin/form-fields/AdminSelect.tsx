import React, { useState, useRef, useEffect } from 'react';

export interface AdminSelectOption {
  value: string;
  label: string;
}

export interface AdminSelectProps {
  label: string;
  value: string;
  options: (AdminSelectOption | string)[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
  allowCustom?: boolean;
  error?: string;
  disabled?: boolean;
  description?: string;
}

export default function AdminSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'اختر أو ابحث من القائمة...',
  required = false,
  containerClassName = '',
  allowCustom = true,
  error,
  disabled = false,
  description
}: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label } format
  const normalizedOptions: AdminSelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter options based on user input
  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const displayValue = normalizedOptions.find(opt => opt.value === value)?.label || value || '';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setSearchTerm(newVal);
    if (allowCustom) {
      onChange(newVal);
    }
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1.5 ${containerClassName}`}>
      <label className="font-abyan-title text-[13px] text-slate-800">
        {label} {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={() => { 
            if (!disabled) {
              setIsOpen(true);
              setSearchTerm('');
            }
          }}
          placeholder={isOpen && displayValue ? displayValue : placeholder}
          disabled={disabled}
          className={`w-full px-3 py-1.5 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-sm text-slate-900 placeholder:text-slate-400 ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer'} ${
            error ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
          }`}
        />

        {/* Floating Custom Scrollable Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="max-h-48 overflow-y-auto custom-thin-scrollbar py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelect(opt.value)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-abyan-body cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-50 text-[#059669] font-medium' 
                          : 'text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-3.5 py-2.5 text-xs text-slate-400 font-abyan-body text-center">
                  {allowCustom ? 'سيتم استخدام القيمة المدخلة' : 'لا توجد نتائج مطابقة'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {description && !error && <p className="text-xs text-slate-400 font-abyan-body mt-0.5">{description}</p>}
      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
    </div>
  );
}
