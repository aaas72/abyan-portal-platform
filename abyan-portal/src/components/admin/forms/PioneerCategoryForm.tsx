import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminTextarea from '../form-fields/AdminTextarea';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminRichTextEditor from '../form-fields/AdminRichTextEditor';
import { PioneerCategoryFormDataSchema, PioneerCategoryFormData } from '@/types/schemas';

export type { PioneerCategoryFormData };

interface PioneerCategoryFormProps {
  id?: string;
  initialData?: PioneerCategoryFormData | null;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
  onSave: (data: PioneerCategoryFormData) => void;
}

export default function PioneerCategoryForm({ id, initialData, isActive, onActiveChange, onSave }: PioneerCategoryFormProps) {
  const [formData, setFormData] = useState<PioneerCategoryFormData>({
    categoryName: '',
    title: '',
    subtitle: '',
    description: '',
    keyFigures: [],
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
        keyFigures: [],
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

  const handleFieldChange = (field: keyof PioneerCategoryFormData, value: any) => {
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
    if (!dataToValidate.categoryName) {
      dataToValidate.categoryName = `cat-${Date.now()}`;
    }
    const result = PioneerCategoryFormDataSchema.safeParse(dataToValidate);
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
      {/* categoryName is auto-generated */}
      
      <AdminInput
        label="عنوان الفئة"
        required
        value={formData.title}
        onChange={(e) => {
          handleFieldChange('title', e.target.value);
          handleFieldChange('categoryName', e.target.value);
        }}
        error={errors.title || errors.categoryName}
        placeholder="مثال: الأدباء والشعراء"
      />



      <AdminInput
        label="العنوان الفرعي"
        required
        value={formData.subtitle}
        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
        error={errors.subtitle}
        placeholder="مثال: رواد الكلمة في أبين"
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
        label="أعلام فرعية (Key Figures)"
        tags={formData.keyFigures || []}
        onChange={(tags) => handleFieldChange('keyFigures', tags)}
        error={errors.keyFigures}
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
