import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminRichTextEditor from "../../form-fields/AdminRichTextEditor";
import { AboutPillarFormData } from "@/types/schemas";

interface AboutPillarFormProps {
  form: UseFormReturn<AboutPillarFormData>;
}

export function AboutPillarForm({ form }: AboutPillarFormProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان الركيزة"
        placeholder="أدخل عنوان الركيزة (مثال: الهوية البصرية)"
        {...register("title")}
        error={errors.title?.message}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <AdminRichTextEditor
            label="وصف الركيزة"
            placeholder="أدخل وصفاً تفصيلياً للركيزة..."
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
    </div>
  );
}
