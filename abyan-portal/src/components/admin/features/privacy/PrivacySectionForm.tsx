import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminRichTextEditor from "../../form-fields/AdminRichTextEditor";
import { PrivacyItem } from "@/types/schemas";

interface PrivacySectionFormProps {
  form: UseFormReturn<PrivacyItem>;
}

export function PrivacySectionForm({ form }: PrivacySectionFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان البند أو الإشعار"
        placeholder="أدخل عنوان مادة أو بند الخصوصية"
        {...register("title")}
        error={errors.title?.message}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <AdminRichTextEditor
            label="الوصف والشرح التفصيلي"
            placeholder="أدخل الشرح التوثيقي والتفصيلي للبند..."
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
    </div>
  );
}
