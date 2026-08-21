import React, { useState, useEffect } from 'react';
import { ContactInfo, ContactInfoSchema, ContactEmailChannel, ContactPhoneChannel } from '@/types/schemas';
import AdminInput from '../form-fields/AdminInput';

export interface ContactFormProps {
  initialData?: Partial<ContactInfo>;
  onSave: (data: ContactInfo) => void;
  id?: string;
  saving?: boolean;
}

export default function ContactForm({ initialData, onSave, id = "contact-form", saving = false }: ContactFormProps) {
  const [emailChannels, setEmailChannels] = useState<ContactEmailChannel[]>([
    { title: '', description: '', email: '' }
  ]);
  const [phoneChannels, setPhoneChannels] = useState<ContactPhoneChannel[]>([
    { title: '', description: '', phone: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      if (initialData.emailChannels && initialData.emailChannels.length > 0) {
        setEmailChannels(initialData.emailChannels);
      } else if (initialData.emails && initialData.emails.length > 0) {
        setEmailChannels(
          initialData.emails.map((e, idx) => ({
            title: idx === 0 ? 'البريد المباشر' : `قناة المراسلة ${idx + 1}`,
            description: '',
            email: e
          }))
        );
      } else {
        setEmailChannels([{ title: '', description: '', email: '' }]);
      }

      if (initialData.phoneChannels && initialData.phoneChannels.length > 0) {
        setPhoneChannels(initialData.phoneChannels);
      } else if (initialData.phones && initialData.phones.length > 0) {
        setPhoneChannels(
          initialData.phones.map((p, idx) => ({
            title: idx === 0 ? 'الهاتف والواتساب المباشر' : `رقم التواصل ${idx + 1}`,
            description: '',
            phone: p
          }))
        );
      } else {
        setPhoneChannels([{ title: '', description: '', phone: '' }]);
      }
    }
    setErrors({});
  }, [initialData]);

  const handleEmailChannelChange = (index: number, field: keyof ContactEmailChannel, value: string) => {
    setEmailChannels(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddEmailChannel = () => {
    if (emailChannels.length >= 6) return;
    setEmailChannels(prev => [
      ...prev,
      {
        title: '',
        description: '',
        email: ''
      }
    ]);
  };

  const handleRemoveEmailChannel = (index: number) => {
    setEmailChannels(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhoneChannelChange = (index: number, field: keyof ContactPhoneChannel, value: string) => {
    setPhoneChannels(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddPhoneChannel = () => {
    if (phoneChannels.length >= 6) return;
    setPhoneChannels(prev => [
      ...prev,
      {
        title: '',
        description: '',
        phone: ''
      }
    ]);
  };

  const handleRemovePhoneChannel = (index: number) => {
    setPhoneChannels(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmailChannels = emailChannels.filter(c => c.title.trim() && c.email.trim());
    const simpleEmails = validEmailChannels.map(c => c.email.trim());

    const validPhoneChannels = phoneChannels.filter(c => c.title.trim() && c.phone.trim());
    const simplePhones = validPhoneChannels.map(c => c.phone.trim());

    const dataToValidate: ContactInfo = {
      emails: simpleEmails,
      emailChannels: validEmailChannels,
      phones: simplePhones,
      phoneChannels: validPhoneChannels
    };
    
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
    <form id={id} onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* EMAIL CHANNELS SECTION */}
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
          <div className="space-y-1 text-right">
            <h2 className="font-abyan-title text-xl text-slate-800 font-normal">قنوات البريد الإلكتروني المخصصة</h2>
            <p className="text-slate-500 font-abyan-body text-sm">حدد اسم القناة ووصفها وعنوان البريد لتظهر بالواجهة</p>
          </div>
          {emailChannels.length < 6 && (
            <button
              type="button"
              onClick={handleAddEmailChannel}
              className="text-sm font-abyan-title text-[#10b981] hover:text-sky-600 cursor-pointer bg-transparent border-none transition-colors"
            >
              إضافة قناة بريد جديدة ←
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {emailChannels.map((channel, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-4 text-right flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/80">
                <span className="text-sm font-abyan-title text-slate-700 font-normal">
                  قناة المراسلة #{idx + 1}
                </span>
                {emailChannels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmailChannel(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-abyan-title bg-transparent border-none cursor-pointer transition-colors"
                  >
                    حذف القناة
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <AdminInput
                  label="اسم نوع البريد / القناة"
                  required
                  value={channel.title}
                  onChange={(e) => handleEmailChannelChange(idx, 'title', e.target.value)}
                  placeholder="مثال: المشاركة في التوثيق..."
                />

                <AdminInput
                  label="عنوان البريد الإلكتروني"
                  type="email"
                  required
                  value={channel.email}
                  onChange={(e) => handleEmailChannelChange(idx, 'email', e.target.value)}
                  placeholder="name@abyan-portal.com"
                />

                <AdminInput
                  label="الوصف التوضيحي للغرض"
                  value={channel.description}
                  onChange={(e) => handleEmailChannelChange(idx, 'description', e.target.value)}
                  placeholder="مثال: لإرسال الوثائق وتراجم الأعلام..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHONE CHANNELS SECTION */}
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
          <div className="space-y-1 text-right">
            <h2 className="font-abyan-title text-xl text-slate-800 font-normal">أرقام الهاتف والتواصل المباشر</h2>
            <p className="text-slate-500 font-abyan-body text-sm">حدد اسم القناة الهاتفية ووصفها والرقم للظهور في صفحة التواصل</p>
          </div>
          {phoneChannels.length < 6 && (
            <button
              type="button"
              onClick={handleAddPhoneChannel}
              className="text-sm font-abyan-title text-[#10b981] hover:text-sky-600 cursor-pointer bg-transparent border-none transition-colors"
            >
              إضافة رقم هاتف جديد ←
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {phoneChannels.map((channel, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-4 text-right flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/80">
                <span className="text-sm font-abyan-title text-slate-700 font-normal">
                  رقم التواصل #{idx + 1}
                </span>
                {phoneChannels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhoneChannel(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-abyan-title bg-transparent border-none cursor-pointer transition-colors"
                  >
                    حذف الرقم
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <AdminInput
                  label="اسم القناة أو المصلحة"
                  required
                  value={channel.title}
                  onChange={(e) => handlePhoneChannelChange(idx, 'title', e.target.value)}
                  placeholder="مثال: الهاتف والواتساب المباشر..."
                />

                <AdminInput
                  label="رقم الهاتف"
                  type="text"
                  required
                  value={channel.phone}
                  onChange={(e) => handlePhoneChannelChange(idx, 'phone', e.target.value)}
                  placeholder="+967 770 000 000"
                />

                <AdminInput
                  label="الوصف التوضيحي والتوقيت"
                  value={channel.description}
                  onChange={(e) => handlePhoneChannelChange(idx, 'description', e.target.value)}
                  placeholder="مثال: متاح خلال أوقات العمل الرسمية..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
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
