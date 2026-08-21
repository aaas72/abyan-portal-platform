"use client";

import React, { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContactForm from "@/components/admin/forms/ContactForm";
import { ContactInfo } from "@/types/schemas";
import { ContactService } from "@/services/contact.service";
import { useToast } from "@/contexts/ToastContext";

export default function AdminContactPage() {
  const toast = useToast();
  const [data, setData] = useState<ContactInfo>({ emails: [], emailChannels: [], phones: [], phoneChannels: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ContactService.getContactInfo();
      if (res) {
        setData(res);
      }
    } catch (error) {
      toast.error("فشل في جلب بيانات التواصل - يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: ContactInfo) => {
    try {
      setSaving(true);
      const res = await ContactService.updateContactInfo(formData);
      if (res) {
        toast.success("تم الحفظ بنجاح - تم تحديث بيانات التواصل على المنصة.");
        setData(res);
      }
    } catch (error: any) {
      toast.error("فشل الحفظ - حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-abyan-title text-emerald-500">
        جاري تحميل بيانات التواصل...
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="إدارة التواصل" 
        description="تعديل أرقام الهواتف ورسائل البريد الإلكتروني الخاصة بالمنصة"
      />

      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-5xl mt-8">
        <ContactForm
          id="contact-form"
          initialData={data}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}
