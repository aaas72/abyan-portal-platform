import React, { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import { HighlightItemFormDataSchema, HighlightItemFormData } from '@/types/schemas';

export type { HighlightItemFormData };

interface HighlightFormProps {
  id?: string;
  initialData?: HighlightItemFormData | null;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
  onSave: (data: HighlightItemFormData) => void;
}



export default function HighlightForm({
  id,
  initialData,
  isActive,
  onActiveChange,
  onSave,
}: HighlightFormProps) {
  const [formData, setFormData] = useState<HighlightItemFormData>({
    title: '',
    category: '',
    description: '',
    linkText: '',
    href: '',
    isActive: isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isActive: isActive ?? initialData.isActive ?? true,
      });
    } else {
      setFormData({
        title: '',
        category: '',
        description: '',
        linkText: '',
        href: '',
        isActive: isActive ?? true,
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (isActive !== undefined) {
      setFormData((prev) => ({ ...prev, isActive }));
    }
  }, [isActive]);

  const handleFieldChange = (field: keyof HighlightItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = HighlightItemFormDataSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSave(result.data);
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="عنوان البطاقة المبرزة"
        required
        placeholder="مثال: الحصون التاريخية الشامخة في أبين"
        value={formData.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        error={errors.title}
      />

      <AdminInput
        label="التصنيف / المجال"
        required
        placeholder="مثال: التراث اللامادي، الموارد الطبيعية..."
        value={formData.category}
        onChange={(e) => handleFieldChange('category', e.target.value)}
        error={errors.category}
      />

      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1.5">
          <label className="font-abyan-title text-[13px] text-slate-800">
            الوصف الشارح والركيزة الوطنية <span className="text-red-500 mr-1">*</span>
          </label>
        </div>
        <textarea
          rows={3}
          placeholder="اكتب وصفاً موجزاً وجذاباً للركيزة الثقافية أو المعلم..."
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border bg-transparent focus:bg-slate-50/50 focus:ring-0 outline-none transition-all font-abyan-body text-sm text-slate-900 placeholder:text-slate-400 ${
            errors.description ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-slate-200 focus:border-[#10b981]'
          }`}
        />
        {errors.description && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{errors.description}</p>}
      </div>

      <AdminInput
        label="نص الرابط الإرشادي"
        required
        placeholder="مثال: تصفح المعالم الأثرية"
        value={formData.linkText}
        onChange={(e) => handleFieldChange('linkText', e.target.value)}
        error={errors.linkText}
      />

      <AdminInput
        label="مسار الرابط (URL)"
        required
        placeholder="مثال: /landmarks أو /pioneers"
        value={formData.href}
        onChange={(e) => handleFieldChange('href', e.target.value)}
        error={errors.href}
      />
    </form>
  );
}
