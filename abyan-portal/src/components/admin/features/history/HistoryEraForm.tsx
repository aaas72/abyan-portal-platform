import React, { useState, useEffect } from 'react';
import AdminInput from '../../form-fields/AdminInput';
import AdminMediaUpload from '../../form-fields/AdminMediaUpload';
import AdminParagraphsInput from '../../form-fields/AdminParagraphsInput';
import AdminTagsInput from '../../form-fields/AdminTagsInput';
import AdminSourcesInput from '../../form-fields/AdminSourcesInput';
import { HistoryEraFormDataSchema, HistoryEraFormData } from '@/types/schemas';

interface HistoryEraFormProps {
  id?: string;
  initialData?: HistoryEraFormData | null;
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: HistoryEraFormData) => void;
}

export default function HistoryEraForm({
  id,
  initialData,
  isPublished,
  onPublishedChange,
  onSave
}: HistoryEraFormProps) {
  const [formData, setFormData] = useState<HistoryEraFormData>({
    startYear: '',
    endYear: '',
    eraTitle: '',
    historicalCapital: '',
    authorName: '',
    shortSummary: '',
    fullDescription: '',
    images: [],
    keyEvents: [],
    notableLandmarks: [],
    isActive: isPublished ?? true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        startYear: initialData.startYear || '',
        endYear: initialData.endYear || '',
        eraTitle: initialData.eraTitle || '',
        historicalCapital: initialData.historicalCapital || '',
        authorName: initialData.authorName || '',
        shortSummary: initialData.shortSummary || '',
        fullDescription: initialData.fullDescription || '',
        images: initialData.images || [],
        keyEvents: initialData.keyEvents || [],
        notableLandmarks: initialData.notableLandmarks || [],
        isActive: isPublished ?? initialData.isActive ?? true
      });
    } else {
      setFormData({
        startYear: '',
        endYear: '',
        eraTitle: '',
        historicalCapital: '',
        authorName: '',
        shortSummary: '',
        fullDescription: '',
        images: [],
        keyEvents: [],
        notableLandmarks: [],
        isActive: isPublished ?? true
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (isPublished !== undefined) {
      setFormData(prev => ({ ...prev, isActive: isPublished }));
    }
  }, [isPublished]);

  const handleFieldChange = (field: keyof HistoryEraFormData, value: any) => {
    const actualValue = value && typeof value === 'object' && 'target' in value ? value.target.value : value;
    setFormData(prev => ({ ...prev, [field]: actualValue }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = HistoryEraFormDataSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const fieldName = String(issue.path[0]);
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    onSave({
      ...result.data,
      authorName: result.data.authorName?.trim() || 'فريق توثيق بوابة أبين'
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="اسم الحقبة"
        value={formData.eraTitle}
        onChange={(e) => handleFieldChange('eraTitle', e.target.value)}
        error={errors.eraTitle}
        required
        placeholder="أدخل اسم الحقبة (مثال: العصر الإسلامي الأوسط)"
      />

      {/* مدخلان محتويان داخل نفس العمود الواحد في الشبكة الرئيسية */}
      <div className="grid grid-cols-2 gap-3">
        <AdminInput
          label="سنة بداية الحقبة"
          value={formData.startYear}
          onChange={(e) => handleFieldChange('startYear', e.target.value)}
          error={errors.startYear}
          required
          placeholder="مثال: 1200 م"
        />

        <AdminInput
          label="سنة نهاية الحقبة"
          value={formData.endYear}
          onChange={(e) => handleFieldChange('endYear', e.target.value)}
          error={errors.endYear}
          required
          placeholder="مثال: 1500 م"
        />
      </div>

      <AdminInput
        label="العاصمة التاريخية أو المركز"
        value={formData.historicalCapital}
        onChange={(e) => handleFieldChange('historicalCapital', e.target.value)}
        error={errors.historicalCapital}
        required
        placeholder="أدخل العاصمة أو المركز التاريخي"
      />

      <AdminInput
        label="اسم الكاتب / الباحث التوثيقي"
        value={formData.authorName || ''}
        onChange={(e) => handleFieldChange('authorName', e.target.value)}
        error={errors.authorName}
        placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
      />

        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
            الوسائط المتعددة (صور، فيديو، صوت - الحد الأقصى 10)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload 
                folderName="abyan-portal/history"
                key={`img-${index}`}
                label={index === 0 ? "الوسائط الرئيسية (الغلاف)" : `ملف إضافي ${index}`}
                value={imgUrl}
                accept="image/*,video/*,audio/*"
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
            {(!formData.images || formData.images.length < 10) && (
              <AdminMediaUpload 
                folderName="abyan-portal/history"
                key={`new-img-${formData.images?.length || 0}`}
                label={`إضافة وسائط ${(formData.images?.length || 0) + 1}`}
                value=""
                accept="image/*,video/*,audio/*"
                onChange={(_, previewUrl) => {
                  if (previewUrl) {
                    handleFieldChange('images', [...(formData.images || []), previewUrl]);
                  }
                }}
              />
            )}
          </div>
        </div>

      <div className="col-span-1 border-t border-slate-100 pt-5 mt-2">
        <AdminTagsInput
          label="أبرز الأحداث"
          tags={formData.keyEvents}
          onChange={(tags) => handleFieldChange('keyEvents', tags)}
          error={errors.keyEvents}
          required
          placeholder="أضف حدثاً (ثم اضغط Enter)"
        />
      </div>

      <div className="col-span-1 border-t border-slate-100 pt-5 mt-2">
        <AdminTagsInput
          label="أبرز المعالم والشواهد"
          tags={formData.notableLandmarks}
          onChange={(tags) => handleFieldChange('notableLandmarks', tags)}
          error={errors.notableLandmarks}
          placeholder="أضف معلماً (ثم اضغط Enter)"
        />
      </div>

      <div className="md:col-span-2">
        <AdminParagraphsInput
          label="الموجز التاريخي السريع"
          value={formData.shortSummary}
          onChange={(val) => handleFieldChange('shortSummary', val)}
          error={errors.shortSummary}
          required
          placeholder="أدخل موجزاً قصيراً للحقبة"
        />
      </div>

      <div className="md:col-span-2">
        <AdminParagraphsInput
          label="السرد التاريخي والتفاصيل الممتدة"
          value={formData.fullDescription}
          onChange={(val) => handleFieldChange('fullDescription', val)}
          error={errors.fullDescription}
          required
          placeholder="أدخل السرد التاريخي المفصل للحقبة..."
        />
      </div>

      <AdminSourcesInput
        sources={formData.sources || []}
        onChange={(sources) => handleFieldChange('sources', sources)}
        containerClassName="md:col-span-2 mt-2"
      />
    </form>
  );
}
