"use client";

import React, { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminInput from "@/components/admin/form-fields/AdminInput";
import { useAuth } from "@/contexts/AuthContext";
import { usersService } from "@/services/users.service";
import { useToast } from "@/contexts/ToastContext";
import { AuthService } from "@/services/auth.service";

export default function AdminAccountPage() {
  const { user, login } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
      }));
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }
    
    const isChangingPassword = formData.oldPassword || formData.newPassword || formData.confirmPassword;
    
    if (isChangingPassword) {
      if (!formData.oldPassword) {
        newErrors.oldPassword = "كلمة المرور الحالية مطلوبة لتغيير كلمة المرور";
      }
      if (!formData.newPassword || formData.newPassword.length < 6) {
        newErrors.newPassword = "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // 1. Update Name
      if (formData.name !== user.name) {
        const res = await usersService.updateUser(user.id, { name: formData.name });
        if (res.success && res.data) {
          login({ ...user, name: formData.name });
        } else {
          throw new Error("فشل في تحديث الاسم");
        }
      }

      // 2. Change Password
      if (isChangingPassword) {
         await AuthService.changePassword({
           oldPassword: formData.oldPassword,
           newPassword: formData.newPassword,
         });
         setFormData(prev => ({
           ...prev,
           oldPassword: "",
           newPassword: "",
           confirmPassword: "",
         }));
      }

      toast.success("تم تحديث بيانات الحساب بنجاح");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء التحديث"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="حسابي"
        description="إدارة بيانات حسابك الشخصي وكلمة المرور."
      />

      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl mt-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="اسم المستخدم"
              type="text"
              value={user?.username || (user as any)?.email || ""}
              readOnly
              disabled
              dir="rtl"
              description="اسم المستخدم فريد ولا يمكن تغييره."
            />

            <AdminInput
              label="الاسم الكامل"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name}
              placeholder="مثال: أحمد عبد الله"
            />
          </div>

          <hr className="border-slate-100 my-2" />
          <div className="flex justify-between items-center -mb-2 mt-2">
            <h3 className="font-abyan-title text-lg text-slate-800">تغيير كلمة المرور</h3>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="font-abyan-body text-xs text-slate-500 hover:text-sky-600 cursor-pointer bg-transparent border-none outline-none transition-colors duration-300"
            >
              {showPasswords ? "إخفاء كلمات المرور" : "إظهار كلمات المرور"}
            </button>
          </div>
          <p className="text-xs text-slate-500 font-abyan-body">
            اترك هذه الحقول فارغة إذا كنت لا ترغب في تغيير كلمة المرور.
          </p>

          <AdminInput
            label="كلمة المرور الحالية"
            type={showPasswords ? "text" : "password"}
            value={formData.oldPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
            error={errors.oldPassword}
            placeholder="أدخل كلمة المرور الحالية"
            dir="rtl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="كلمة المرور الجديدة"
              type={showPasswords ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              error={errors.newPassword}
              placeholder="كلمة مرور جديدة"
              dir="rtl"
            />
            
            <AdminInput
              label="تأكيد كلمة المرور الجديدة"
              type={showPasswords ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
              placeholder="تأكيد كلمة المرور"
              dir="rtl"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-transparent text-slate-800 hover:text-[#10b981] font-abyan-title text-sm cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
