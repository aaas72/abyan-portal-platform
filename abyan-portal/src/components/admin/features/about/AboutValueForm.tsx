import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminRichTextEditor from "../../form-fields/AdminRichTextEditor";
import { AboutValueFormData } from "@/types/schemas";

interface AboutValueFormProps {
  form: UseFormReturn<AboutValueFormData>;
}

export function AboutValueForm({ form }: AboutValueFormProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان القيمة أو المبدأ"
        placeholder="أدخل عنوان القيمة"
        {...register("title")}
        error={errors.title?.message}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <AdminRichTextEditor
            label="وصف القيمة"
            placeholder="أدخل وصفاً تفصيلياً للقيمة..."
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
    </div>
  );
}
