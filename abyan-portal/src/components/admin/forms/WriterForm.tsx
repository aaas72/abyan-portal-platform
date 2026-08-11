'use client';

import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import { UserFormDataSchema, UserFormData } from '@/types/schemas';

export type { UserFormData };

interface WriterFormProps {
  id?: string;
  initialData?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
  isEditMode?: boolean;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
}

export default function WriterForm({ id, initialData, onSubmit, isEditMode = false, isActive, onActiveChange }: WriterFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    role: 'writer',
    isActive: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        username: initialData.username,
        role: initialData.role,
        isActive: isActive ?? initialData.isActive ?? true,
        password: '' // Don't populate password on edit
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isActive !== undefined) {
      setFormData(prev => ({ ...prev, isActive }));
    }
  }, [isActive]);

  const handleFieldChange = (field: keyof UserFormData, value: any) => {
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
    
    // Validate using Zod
    const result = UserFormDataSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const fieldName = String(issue.path[0]);
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      
      // If editing and password is empty, ignore password error
      if (isEditMode && !formData.password) {
         delete fieldErrors['password'];
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }
    }
    
    setErrors({});
    
    // Prepare submission data (exclude empty password on edit)
    const submissionData = { ...formData };
    if (isEditMode && !submissionData.password) {
      delete submissionData.password;
    }
    
    onSubmit(submissionData);
  };

  const roleOptions = [
    { value: 'writer', label: 'كاتب محتوى' },
    { value: 'admin', label: 'مدير نظام' }
  ];

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-y-5">
      <AdminInput
        label="الاسم الكامل"
        type="text"
        required
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        error={errors.name}
        placeholder="مثال: أحمد عبد الله"
      />

      <AdminInput
        label="اسم المستخدم"
        type="text"
        required
        value={formData.username}
        onChange={(e) => handleFieldChange('username', e.target.value)}
        error={errors.username}
        placeholder="مثال: ahmed"
        dir="ltr"
      />

      <AdminInput
        label="كلمة المرور"
        type="password"
        required={!isEditMode}
        value={formData.password || ''}
        onChange={(e) => handleFieldChange('password', e.target.value)}
        error={errors.password}
        placeholder={isEditMode ? 'اترك الحقل فارغاً للإبقاء على كلمة المرور الحالية' : 'أدخل كلمة مرور قوية'}
        dir="ltr"
        description={isEditMode ? 'قم بتعبئة هذا الحقل فقط إذا كنت ترغب في تغيير كلمة المرور للمستخدم.' : 'يجب أن لا تقل عن 6 أحرف.'}
      />

      <AdminSelect
        label="الدور والصلاحية (Role)"
        required
        value={formData.role}
        onChange={(value) => handleFieldChange('role', value as 'admin' | 'writer')}
        options={roleOptions}
        error={errors.role}
        description="المدير يمتلك كامل الصلاحيات بما فيها إدارة الكُتّاب. الكاتب يمكنه فقط إدارة المحتوى."
      />
    </form>
  );
}
