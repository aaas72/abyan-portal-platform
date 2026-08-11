import React, { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import { LandingSectionFormDataSchema, LandingSectionFormData } from '@/types/schemas';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';

export type { LandingSectionFormData };

interface LandingSectionFormProps {
  id?: string;
  initialData?: LandingSectionFormData | null;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
  onSave: (data: LandingSectionFormData) => void;
}

export default function LandingSectionForm({
  id,
  initialData,
  isActive,
  onActiveChange,
  onSave,
}: LandingSectionFormProps) {
  const [formData, setFormData] = useState<LandingSectionFormData>({
    sectionId: '',
    name: '',
    title: '',
    subtitle: '',
    images: [],

    isActive: isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        images: initialData.images || [],

        isActive: isActive ?? initialData.isActive ?? true,
      });
    } else {
      setFormData({
        sectionId: '',
        name: '',
        title: '',
        subtitle: '',

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

  const handleFieldChange = (field: keyof LandingSectionFormData, value: any) => {
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
    const result = LandingSectionFormDataSchema.safeParse(formData);

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
        label="اسم القسم الرئيسي"
        required
        placeholder="مثال: قسم الترحيب والواجهة (Hero)"
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        error={errors.name}
      />

      <AdminInput
        label="العنوان البارز للقسم (Header Title)"
        placeholder="مثال: أبين • ذاكرة تاريخية متجذرة وثقافة ممتدة عبر الأزمان"
        value={formData.title || ''}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        error={errors.title}
      />

      <AdminInput
        label="العنوان الفرعي أو الشارح (Subtitle)"
        placeholder="مثال: البوابة الثقافية الوطنية الموحدة لتاريخ وأعلام ومعالم محافظة أبين"
        value={formData.subtitle || ''}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
      />

      {/* UPLOAD SECTION - Unified format (Always on the Left) */}
      <div className="order-first md:order-last md:col-start-2 md:row-start-1 md:row-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 h-fit">
        <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
          صور الخلفية للهيرو (اختياري)
          <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
            (الحد الأقصى 5 صور)
          </span>
        </label>
        <div className="grid grid-cols-1 gap-4">
          {(formData.images || []).map((imgUrl, index) => (
            <AdminMediaUpload 
              folderName="abyan-portal/landing"
              key={`img-${index}`}
              label={index === 0 ? "صورة الهيرو الأساسية" : `صورة إضافية ${index + 1}`}
              value={imgUrl}
              accept="image/*"
              onChange={(_, previewUrl) => {
                const newImages = [...(formData.images || [])];
                if (!previewUrl) {
                  newImages.splice(index, 1);
                } else {
                  newImages[index] = previewUrl;
                }
                handleFieldChange('images', newImages);
              }}
            />
          ))}
          {(!formData.images || formData.images.length < 5) && (
            <AdminMediaUpload 
              folderName="abyan-portal/landing"
              key={`new-img-${formData.images?.length || 0}`}
              label={`إضافة صورة ${(formData.images?.length || 0) + 1}`}
              value=""
              accept="image/*"
              onChange={(_, previewUrl) => {
                if (previewUrl) {
                  handleFieldChange('images', [...(formData.images || []), previewUrl]);
                }
              }}
            />
          )}
        </div>
      </div>

      {formData.sectionId === 'highlights' && (
        <div className="col-span-1 md:col-span-2 p-4 mt-2 bg-sky-50 border border-sky-100 rounded-xl flex flex-col gap-2">
          <p className="text-sm text-sky-800 font-abyan-body">
            <strong>ملاحظة:</strong> أنت الآن تقوم بتعديل (عناوين) قسم المقتطفات الترويجية. لإضافة أو تعديل البطاقات المبرزة المتعددة التي تظهر داخل هذا القسم، يرجى التوجه إلى التبويب المخصص <strong>"البطاقات المبرزة (Highlights)"</strong> في أعلى صفحة الهبوط.
          </p>
        </div>
      )}
    </form>
  );
}
