import React from "react";
import { UseFormReturn } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import { AboutStatFormData } from "@/types/schemas";

interface AboutStatFormProps {
  form: UseFormReturn<AboutStatFormData>;
}

export function AboutStatForm({ form }: AboutStatFormProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="number"
        label="الرقم أو الإحصائية"
        placeholder="أدخل الرقم (مثال: 11)"
        {...register("number")}
        error={errors.number?.message}
      />

      <AdminInput
        id="label"
        label="تسمية الإحصائية"
        placeholder="أدخل التسمية (مثال: مديرية)"
        {...register("label")}
        error={errors.label?.message}
      />
    </div>
  );
}
