import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminTextarea from '../form-fields/AdminTextarea';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminRichTextEditor from '../form-fields/AdminRichTextEditor';
import { ArchiveCategoryFormDataSchema, ArchiveCategoryFormData } from '@/types/schemas';

export type { ArchiveCategoryFormData };

interface ArchiveCategoryFormProps {
  id?: string;
  initialData?: ArchiveCategoryFormData | null;
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSubmit: (data: ArchiveCategoryFormData) => void;
}

export default function ArchiveCategoryForm({ id, initialData, isPublished, onPublishedChange, onSubmit }: ArchiveCategoryFormProps) {
  const [formData, setFormData] = useState<ArchiveCategoryFormData>({
    categoryName: '',
    title: '',
    subtitle: '',
    description: '',
    keyTags: [],
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
        keyTags: [],
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

  const handleFieldChange = (field: keyof ArchiveCategoryFormData, value: any) => {
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
    const result = ArchiveCategoryFormDataSchema.safeParse(formData);
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
    onSubmit(result.data);
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="العنوان الشارح"
        type="text"
        required
        value={formData.title}
        onChange={(e) => {
          handleFieldChange('title', e.target.value);
          handleFieldChange('categoryName', e.target.value);
        }}
        error={errors.title || errors.categoryName}
        placeholder="مثال: وثائق ومخطوطات تاريخية"
        description="الاسم الذي سيظهر للمستخدمين في الواجهة."
      />

      <AdminInput
        label="العنوان الفرعي"
        required
        value={formData.subtitle}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
        placeholder="مثال: أرشيف أبين الوثائقي"
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
        label="تصنيفات فرعية (Key Tags)"
        tags={formData.keyTags || []}
        onChange={(tags) => handleFieldChange('keyTags', tags)}
        error={errors.keyTags}
        containerClassName="md:col-span-2"
      />

      <AdminRichTextEditor
        label="تفاصيل وشرح إضافي للفئة"
        value={formData.details?.join('\n\n') || ''}
        onChange={(content) => handleFieldChange('details', content ? [content] : [])}
        error={errors.details}
        containerClassName="md:col-span-2"
        placeholder="أدخل الشرح التوثيقي والتفاصيل الإضافية..."
      />
    </form>
  );
}
