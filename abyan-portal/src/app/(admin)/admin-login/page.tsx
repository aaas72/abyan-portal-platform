"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth.service";
import { useEffect } from "react";
import AdminInput from "@/components/admin/form-fields/AdminInput";

const LoginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
          <div className="animate-pulse bg-slate-100 rounded-3xl p-10 w-full max-w-md h-96"></div>
        </div>
      }
    >
      <AdminLoginContent />
    </React.Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl =
    rawReturnUrl && !rawReturnUrl.includes("admin-login")
      ? rawReturnUrl
      : "/admin-dashboard";

  useEffect(() => {
    // Redirect instantly if user lands here already authenticated,
    // but don't interfere if they just successfully submitted the form
    if (!isLoading && isAuthenticated && !isSuccess) {
      router.push("/admin-dashboard");
    }
  }, [isAuthenticated, isLoading, router, isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg(null);
      const res = await AuthService.login(data);
      if (res && res.user) {
        setIsSuccess(true);
        login(res.user);
        setTimeout(() => {
          router.push(returnUrl);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          "فشل في تسجيل الدخول، تحقق من البيانات.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-abyan-title text-3xl text-[#10b981] mb-2">
            بوابة أبين الثقافية
          </div>
          <p className="font-abyan-body text-sm text-slate-500">
            تسجيل الدخول لإدارة بوابة أبين الثقافية
          </p>
        </div>

        {/* Separator */}
        <hr className="border-slate-200 mb-8" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMsg && (
            <div className="text-red-500 text-sm font-abyan-body text-center">
              {errorMsg}
            </div>
          )}

          <AdminInput
            label="اسم المستخدم"
            type="text"
            {...register("username")}
            disabled={isSubmitting}
            placeholder="مثال: admin"
            dir="rtl"
            error={errors.username?.message}
          />

          <div>
            <AdminInput
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              disabled={isSubmitting}
              placeholder="••••••••"
              dir="rtl"
              error={errors.password?.message}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="font-abyan-body text-xs text-slate-500 hover:text-sky-600 cursor-pointer bg-transparent border-none outline-none transition-colors duration-300"
              >
                {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              </button>
            </div>
          </div>

          <hr className="border-slate-200 my-6" />

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full mt-4 cursor-pointer text-slate-900 hover:text-sky-600 font-abyan-title text-sm transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed bg-transparent border-none outline-none"
          >
            {isSuccess
              ? "تم الدخول بنجاح، جاري التوجيه..."
              : isSubmitting
                ? "جاري التحقق..."
                : "دخول للوحة التحكم"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-abyan-body text-xs text-slate-400">
            محفوظ في الأرشيف الرقمي لبوابة أبين الثقافية
          </p>
        </div>
      </div>
    </div>
  );
}
