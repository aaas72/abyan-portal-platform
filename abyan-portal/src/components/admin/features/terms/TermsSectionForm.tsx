import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminRichTextEditor from "../../form-fields/AdminRichTextEditor";
import { TermsItem } from "@/types/schemas";

interface TermsSectionFormProps {
  form: UseFormReturn<TermsItem>;
}

export function TermsSectionForm({ form }: TermsSectionFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان البند أو الشرط"
        placeholder="أدخل عنوان المادة أو الشرط"
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
