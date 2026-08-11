import React, { useState, useEffect } from 'react';
import { ContactInfo, ContactInfoSchema } from '@/types/schemas';
import AdminTagsInput from '../form-fields/AdminTagsInput';

export interface ContactFormProps {
  initialData?: Partial<ContactInfo>;
  onSave: (data: ContactInfo) => void;
  id?: string;
  saving?: boolean;
}

export default function ContactForm({ initialData, onSave, id = "contact-form", saving = false }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactInfo>({
    emails: [],
    phones: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        emails: initialData.emails || [],
        phones: initialData.phones || [],
      });
    }
    setErrors({});
  }, [initialData]);

  const handleFieldChange = (field: keyof ContactInfo, value: any) => {
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
    
    const result = ContactInfoSchema.safeParse(dataToValidate);
    
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
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      <div className="md:col-span-2">
        <div className="space-y-2 border-b border-slate-100 pb-4 mb-6">
          <h2 className="font-abyan-title text-xl text-slate-800">بيانات الاتصال المباشرة</h2>
          <p className="text-slate-500 font-abyan-body text-sm">أضف الأرقام والإيميلات بالضغط على زر Enter بعد كل إدخال.</p>
        </div>
      </div>

      <AdminTagsInput
        label="رسائل البريد الإلكتروني (بحد أقصى 5)"
        tags={formData.emails}
        onChange={(newEmails) => handleFieldChange('emails', newEmails)}
        placeholder="example@abyan-portal.com"
        error={errors.emails}
      />

      <AdminTagsInput
        label="أرقام الهواتف (بحد أقصى 5)"
        tags={formData.phones}
        onChange={(newPhones) => handleFieldChange('phones', newPhones)}
        placeholder="+967 770 000 000"
        error={errors.phones}
      />

      <div className="md:col-span-2 pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-transparent text-slate-800 hover:text-[#10b981] font-abyan-title text-sm cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
