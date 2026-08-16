import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import AdminSourcesInput from '../form-fields/AdminSourcesInput';
import { EconomyPhotoCardFormDataSchema, EconomyPhotoCardFormData } from '@/types/schemas';

export type { EconomyPhotoCardFormData };

interface EconomyPhotoCardFormProps {
  id?: string;
  initialData?: EconomyPhotoCardFormData | null;
  pillars: { value: string; label: string }[];
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: EconomyPhotoCardFormData) => void;
}

export default function EconomyPhotoCardForm({ id, initialData, pillars, isPublished, onPublishedChange, onSave }: EconomyPhotoCardFormProps) {
  const [formData, setFormData] = useState<EconomyPhotoCardFormData>({
    pillar: '',
    title: '',
    authorName: '',
    tag: '',
    images: [],
    location: '',
    description: '',
    bgGradient: '',
    isActive: isPublished ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authorName: initialData.authorName || '',
        images: initialData.images || [],
        isActive: isPublished ?? initialData.isActive ?? true
      });
    } else {
      setFormData({
        pillar: '',
        title: '',
        authorName: '',
        tag: '',
        images: [],
        location: '',
        description: '',
        bgGradient: '',
        isActive: isPublished ?? true
      });
    }
  }, [initialData, isPublished]);

  const handleFieldChange = (field: keyof EconomyPhotoCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const result = EconomyPhotoCardFormDataSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* قطاع الاقتصاد - Takes full width on mobile, right column on desktop */}
        <AdminSelect
          label="قطاع الاقتصاد"
          required
          options={pillars}
          value={formData.pillar}
          onChange={(val) => handleFieldChange('pillar', val)}
          error={errors.pillar}
          placeholder="اختر القطاع الاقتصادي..."
        />

        {/* MEDIA UPLOAD SECTION - Takes left column on desktop, spans multiple rows */}
        <div className="md:col-start-1 md:row-start-2 md:row-span-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-2">
            صور العنصر الاقتصادي
            <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">(الحد الأقصى 5 صور)</span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload 
                folderName="abyan-portal/economy"
                key={`img-${index}`}
                label={index === 0 ? "الوسائط الرئيسية (الغلاف)" : `صورة إضافية ${index}`}
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
            {(!formData.images || formData.images.length < 5) && (
              <AdminMediaUpload 
                folderName="abyan-portal/economy"
                key={`new-img-${formData.images?.length || 0}`}
                label={`إضافة صورة ${(formData.images?.length || 0) + 1}`}
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

        {/* DETAILS SECTION - Takes right column */}
        <AdminInput
          label="عنوان العنصر"
          type="text"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          error={errors.title}
          placeholder="مثال: قطن أبين طويل التيلة، العسل الأبيني..."
        />

        <AdminInput
          label="اسم الكاتب / الباحث التوثيقي"
          type="text"
          value={formData.authorName || ''}
          onChange={(e) => handleFieldChange('authorName', e.target.value)}
          error={errors.authorName}
          placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
        />

        <AdminInput
          label="النوع / التصنيف الفرعي"
          type="text"
          value={formData.tag}
          onChange={(e) => handleFieldChange('tag', e.target.value)}
          error={errors.tag}
          placeholder="مثال: محصول زراعي، منتج حيواني..."
        />

        <AdminInput
          label="الموقع أو المنشأة"
          type="text"
          value={formData.location}
          onChange={(e) => handleFieldChange('location', e.target.value)}
          error={errors.location}
          placeholder="مثال: دلتا أبين، مزارع مديرية خنفر..."
        />

        <AdminParagraphsInput
          label="الوصف والشرح التوثيقي"
          required
          value={formData.description}
          onChange={(val) => handleFieldChange('description', val)}
          error={errors.description}
          placeholder="اكتب التوثيق الاقتصادي..."
          containerClassName="md:col-span-2 mt-2"
        />

        <AdminSourcesInput
          sources={formData.sources || []}
          onChange={(sources) => handleFieldChange('sources', sources)}
          containerClassName="md:col-span-2 mt-2"
        />
      </div>
    </form>
  );
}
