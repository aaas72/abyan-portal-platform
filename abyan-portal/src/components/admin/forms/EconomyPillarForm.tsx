import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import AdminSelect from '../form-fields/AdminSelect';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import { EconomyPillarFormDataSchema, EconomyPillarFormData } from '@/types/schemas';

export type { EconomyPillarFormData };

interface EconomyPillarFormProps {
  id?: string;
  initialData?: EconomyPillarFormData | null;
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: EconomyPillarFormData) => void;
}

export default function EconomyPillarForm({ id, initialData, isPublished, onPublishedChange, onSave }: EconomyPillarFormProps) {
  const [formData, setFormData] = useState<EconomyPillarFormData>({
    pillarName: '',
    title: '',
    images: [],
    subtitle: '',
    description: '',
    keyProducts: [],
    details: [],
    isActive: isPublished ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isActive: isPublished ?? initialData.isActive ?? true
      });
    } else {
      setFormData({
        pillarName: '',
        title: '',
        subtitle: '',
        images: [],
        description: '',
        keyProducts: [],
        details: [],
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

  const handleFieldChange = (field: keyof EconomyPillarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const result = EconomyPillarFormDataSchema.safeParse(formData);
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
    onSave(result.data);
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="اسم / عنوان القطاع"
        type="text"
        required
        value={formData.title}
        onChange={(e) => {
          handleFieldChange('title', e.target.value);
          handleFieldChange('pillarName', e.target.value);
        }}
        error={errors.title || errors.pillarName}
        placeholder="مثال: الزراعة ودلتا أبين وبنا..."
      />
      {/* MEDIA UPLOAD SECTION - Left side column */}
      <div className="order-first md:order-last md:col-start-2 md:row-start-1 md:row-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 h-fit">
        <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
          صور ومرفقات القطاع
          <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
            (الحد الأقصى 5 صور)
          </span>
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


      <AdminInput
        label="الموجز الشارح"
        type="text"
        required
        value={formData.subtitle}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
        placeholder="مثال: سلة غذاء الجنوب والزراعة المروية..."
      />

      <AdminTagsInput 
        label="أبرز المنتجات أو المشاريع المرتبطة بالقطاع"
        tags={formData.keyProducts}
        onChange={(tags) => handleFieldChange('keyProducts', tags)}
        error={errors.keyProducts}
      />

      <AdminTagsInput 
        label="الأهمية الاقتصادية والتفاصيل التنموية"
        tags={formData.details}
        onChange={(tags) => handleFieldChange('details', tags)}
        error={errors.details}
      />

      <AdminParagraphsInput
        label="الشرح التوثيقي التنموي والاقتصادي (فقرات)"
        required
        value={formData.description}
        onChange={(description) => handleFieldChange('description', description)}
        error={errors.description}
        placeholder="اكتب التوثيق الاقتصادي، نظام الري وسدود بنا وحسان، والإنتاج التنموي..."
        containerClassName="md:col-span-2 mt-2"
      />
    </form>
  );
}
