import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import AdminInput from "../../form-fields/AdminInput";
import AdminParagraphsInput from "../../form-fields/AdminParagraphsInput";
import { CopyrightSectionFormData } from "@/types/schemas";

interface CopyrightSectionFormProps {
  form: UseFormReturn<CopyrightSectionFormData>;
}

export function CopyrightSectionForm({ form }: CopyrightSectionFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <AdminInput
        id="title"
        label="عنوان البند أو المادة"
        placeholder="أدخل عنوان المادة أو البند القانوني"
        {...register("title")}
        error={errors.title?.message}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <AdminParagraphsInput
            label="الوصف والشرح التفصيلي"
            placeholder="أدخل الشرح التوثيقي والتفصيلي للبند"
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
    </div>
  );
}
