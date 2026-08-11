import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminTagsInput from "../../form-fields/AdminTagsInput";
import { AboutScopeFormData } from "@/types/schemas";

interface AboutScopeFormProps {
  form: UseFormReturn<AboutScopeFormData>;
}

export function AboutScopeForm({ form }: AboutScopeFormProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان النطاق"
        placeholder="أدخل عنوان النطاق (مثال: توثيق المعالم الأثرية)"
        {...register("title")}
        error={errors.title?.message}
      />

      <AdminInput
        id="summary"
        label="الملخص"
        placeholder="ملخص قصير للنطاق (يظهر كـ Tag)"
        {...register("summary")}
        error={errors.summary?.message}
      />

      <Controller
        control={control}
        name="items"
        render={({ field }) => (
          <AdminTagsInput
            label="عناصر ومفردات النطاق"
            placeholder="اكتب عنصراً ثم اضغط Enter (مثال: المساجد التاريخية)"
            tags={field.value || []}
            onChange={field.onChange}
            error={errors.items?.message}
          />
        )}
      />
    </div>
  );
}
