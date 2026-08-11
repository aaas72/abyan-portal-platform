import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminTextarea from '../form-fields/AdminTextarea';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import { LandmarkCategoryFormDataSchema, LandmarkCategoryFormData } from '@/types/schemas';

export type { LandmarkCategoryFormData };

interface LandmarkCategoryFormProps {
  id?: string;
  initialData?: LandmarkCategoryFormData | null;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
  onSave: (data: LandmarkCategoryFormData) => void;
}

export default function LandmarkCategoryForm({ id, initialData, isActive, onActiveChange, onSave }: LandmarkCategoryFormProps) {
  const [formData, setFormData] = useState<LandmarkCategoryFormData>({
    categoryName: '',
    title: '',
    subtitle: '',
    description: '',
    keyLandmarks: [],
    details: [],
    isActive: isActive ?? true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isActive: isActive ?? initialData.isActive ?? true
      });
    } else {
      setFormData({
        categoryName: '',
        title: '',
        subtitle: '',
        description: '',
        keyLandmarks: [],
        details: [],
        isActive: isActive ?? true
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (isActive !== undefined) {
      setFormData(prev => ({ ...prev, isActive }));
    }
  }, [isActive]);

  const handleFieldChange = (field: keyof LandmarkCategoryFormData, value: any) => {
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
    const dataToValidate = { ...formData };
    const result = LandmarkCategoryFormDataSchema.safeParse(dataToValidate);
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
        required
        value={formData.title}
        onChange={(e) => {
          handleFieldChange('title', e.target.value);
          handleFieldChange('categoryName', e.target.value);
        }}
        error={errors.title || errors.categoryName}
        placeholder="مثال: الحصون التاريخية والتراث المعماري"
      />

      <AdminInput
        label="العنوان الفرعي"
        required
        value={formData.subtitle}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
        placeholder="مثال: تراث أبين المعماري"
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
        label="معالم فرعية (Key Landmarks)"
        tags={formData.keyLandmarks}
        onChange={(tags) => handleFieldChange('keyLandmarks', tags)}
        error={errors.keyLandmarks}
        containerClassName="md:col-span-2"
      />

      <AdminParagraphsInput
        label="تفاصيل إضافية (Details)"
        value={formData.details.join('\n\n')}
        onChange={(paragraphs) => handleFieldChange('details', paragraphs ? paragraphs.split('\n\n') : [])}
        error={errors.details}
        containerClassName="md:col-span-2"
      />
    </form>
  );
}
