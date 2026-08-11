import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminTextarea from '../form-fields/AdminTextarea';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import { CultureCategoryFormDataSchema, CultureCategoryFormData } from '@/types/schemas';

export type { CultureCategoryFormData };

interface CultureCategoryFormProps {
  id?: string;
  initialData?: CultureCategoryFormData | null;
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: CultureCategoryFormData) => void;
}

export default function CultureCategoryForm({ id, initialData, isPublished, onPublishedChange, onSave }: CultureCategoryFormProps) {
  const [formData, setFormData] = useState<CultureCategoryFormData>({
    categoryName: '',
    title: '',
    subtitle: '',
    description: '',
    primaryTags: [],
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
        categoryName: '',
        title: '',
        subtitle: '',
        description: '',
        primaryTags: [],
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

  const handleFieldChange = (field: keyof CultureCategoryFormData, value: any) => {
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
    const result = CultureCategoryFormDataSchema.safeParse(formData);
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
        label="اسم / عنوان الفئة"
        type="text"
        required
        value={formData.title}
        onChange={(e) => {
          handleFieldChange('title', e.target.value);
          handleFieldChange('categoryName', e.target.value);
        }}
        error={errors.title || errors.categoryName}
        placeholder="مثال: شعر الدان والقصيدة الشعبية..."
      />



      <AdminInput
        label="الموجز الشارح"
        type="text"
        required
        value={formData.subtitle}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
        placeholder="مثال: الرمزية الأدبية للدان الأبيني وأصوله..."
      />

      <AdminTextarea
        label="الوصف"
        required
        value={formData.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
        error={errors.description}
        placeholder="اكتب وصفاً للفئة هنا..."
        containerClassName="md:col-span-2"
        rows={4}
      />

      <AdminTagsInput 
        label="وسوم / مقتطفات (Primary Tags)"
        tags={formData.primaryTags || []}
        onChange={(tags) => handleFieldChange('primaryTags', tags)}
        error={errors.primaryTags}
        containerClassName="md:col-span-2"
      />

      <AdminParagraphsInput
        label="تفاصيل إضافية (Details)"
        value={formData.details?.join('\n\n') || ''}
        onChange={(paragraphs) => handleFieldChange('details', paragraphs ? paragraphs.split('\n\n') : [])}
        error={errors.details}
        containerClassName="md:col-span-2"
      />
    </form>
  );
}
