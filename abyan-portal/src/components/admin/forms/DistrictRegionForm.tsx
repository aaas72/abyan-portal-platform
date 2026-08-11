import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminInput from "../form-fields/AdminInput";

import AdminTextarea from "../form-fields/AdminTextarea";
import { DistrictRegionFormData, DistrictRegionFormDataSchema } from "@/types/schemas";

export { type DistrictRegionFormData } from "@/types/schemas";

interface DistrictRegionFormProps {
  id?: string;
  initialData?: DistrictRegionFormData | null;
  onSubmit: (data: DistrictRegionFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function DistrictRegionForm({
  id,
  initialData,
  onSubmit,
  isSubmitting = false,
}: DistrictRegionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DistrictRegionFormData>({
    resolver: zodResolver(DistrictRegionFormDataSchema),
    defaultValues: {
      regionKey: "",
      regionLabel: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        regionKey: `reg_${Date.now()}`,
        regionLabel: "",
        description: "",
        isActive: true,
      });
    }
  }, [initialData, reset]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <input type="hidden" {...register("regionKey")} />

          <AdminInput
            label="اسم التقسيم العُرفي (عربي)"
            placeholder="مثال: العاصمة ودلتا أبين والساحل"
            {...register("regionLabel")}
            error={errors.regionLabel?.message}
          />
        </div>

        <AdminTextarea
          label="وصف التقسيم ومناطق الثقل"
          placeholder="مثال: وهي مناطق الثقل الإداري، الزراعي (الدلتا)، والشريط الساحلي..."
          {...register("description")}
          error={errors.description?.message}
          rows={4}
        />

      </div>
    </form>
  );
}
