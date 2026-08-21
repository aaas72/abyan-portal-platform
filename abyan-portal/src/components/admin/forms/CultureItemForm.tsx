import { useState, useEffect } from "react";
import AdminInput from "../form-fields/AdminInput";
import AdminSelect from "../form-fields/AdminSelect";
import AdminMediaUpload from "../form-fields/AdminMediaUpload";
import AdminRichTextEditor from "../form-fields/AdminRichTextEditor";
import AdminSourcesInput from "../form-fields/AdminSourcesInput";
import {
  CultureItemFormDataSchema,
  CultureItemFormData,
} from "@/types/schemas";

export type { CultureItemFormData };

interface CultureItemFormProps {
  id?: string;
  initialData?: CultureItemFormData | null;
  categories: { value: string; label: string }[];
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: CultureItemFormData) => void;
}

export default function CultureItemForm({
  id,
  initialData,
  categories,
  isPublished,
  onPublishedChange,
  onSave,
}: CultureItemFormProps) {
  const [formData, setFormData] = useState<CultureItemFormData>({
    category: "",
    title: "",
    authorName: "",
    images: [],
    tag: "",
    location: "",
    description: "",
    bgGradient: "",
    isActive: isPublished ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authorName: initialData.authorName || "",
        images: initialData.images || [],
        isActive: isPublished ?? initialData.isActive ?? true,
      });
    } else {
      setFormData({
        category: "",
        title: "",
        authorName: "",
        tag: "",
        images: [],
        location: "",
        description: "",
        bgGradient: "",
        isActive: isPublished ?? true,
      });
    }
  }, [initialData, isPublished]);

  const handleFieldChange = (field: keyof CultureItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const result = CultureItemFormDataSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const finalData: CultureItemFormData = {
        ...formData,
        authorName: formData.authorName?.trim() || 'فريق توثيق بوابة أبين'
      };
      onSave(finalData);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* RIGHT COLUMN: ALL INPUTS */}
        <div className="space-y-4">
          <AdminSelect
            label="الفئة الثقافية والتراثية"
            required
            options={categories}
            value={formData.category}
            onChange={(val) => handleFieldChange("category", val)}
            error={errors.category}
            placeholder="اختر الفئة الثقافية..."
          />

          <AdminInput
            label="اسم العنصر التراثي أو الفلكلوري"
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            error={errors.title}
            placeholder="مثال: رقصة الشرح، الدان الأبيني، المزمار..."
          />

          <AdminInput
            label="اسم الكاتب / الباحث التوثيقي"
            type="text"
            value={formData.authorName || ""}
            onChange={(e) => handleFieldChange("authorName", e.target.value)}
            error={errors.authorName}
            placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
          />

          <AdminInput
            label="اللقب أو الوصف الموجز"
            type="text"
            value={formData.tag}
            onChange={(e) => handleFieldChange("tag", e.target.value)}
            error={errors.tag}
            placeholder="مثال: فنون أداء شعبية • دلتا أبين"
          />

          <AdminInput
            label="النطاق الجغرافي أو المنشأ"
            type="text"
            value={formData.location}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            error={errors.location}
            placeholder="مثال: مديرية لودر، كافة أنحاء المحافظة..."
          />
        </div>

        {/* LEFT COLUMN: MEDIA UPLOAD ONLY */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 sticky top-4">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
            صور ومرفقات العنصر
            <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
              (الحد الأقصى 10 صور)
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload
                folderName="abyan-portal/culture"
                key={`img-${index}`}
                label={
                  index === 0
                    ? "الوسائط الرئيسية (الغلاف)"
                    : `صورة إضافية ${index}`
                }
                value={imgUrl}
                accept="image/*,video/*,audio/*"
                onChange={(_, previewUrl) => {
                  const newImages = [...(formData.images || [])];
                  if (!previewUrl) {
                    newImages.splice(index, 1);
                  } else {
                    newImages[index] = previewUrl;
                  }
                  handleFieldChange("images", newImages);
                }}
              />
            ))}
            {(!formData.images || formData.images.length < 10) && (
              <AdminMediaUpload
                folderName="abyan-portal/culture"
                key={`new-img-${formData.images?.length || 0}`}
                label={`إضافة صورة ${(formData.images?.length || 0) + 1}`}
                value=""
                accept="image/*,video/*,audio/*"
                onChange={(_, previewUrl) => {
                  if (previewUrl) {
                    handleFieldChange("images", [
                      ...(formData.images || []),
                      previewUrl,
                    ]);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* FULL WIDTH: DESCRIPTION & SOURCES */}
      <div className="space-y-4">
        <AdminRichTextEditor
          label="الوصف والشرح التوثيقي"
          required
          value={formData.description}
          onChange={(val) => handleFieldChange("description", val)}
          error={errors.description}
          placeholder="اكتب الشرح التوثيقي والتفاصيل التراثية..."
        />

        <AdminSourcesInput
          sources={formData.sources || []}
          onChange={(sources) => handleFieldChange("sources", sources)}
          containerClassName="mt-2"
        />
      </div>
    </form>
  );
}
