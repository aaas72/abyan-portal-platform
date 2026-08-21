import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminRichTextEditor from '../form-fields/AdminRichTextEditor';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import AdminSourcesInput from '../form-fields/AdminSourcesInput';
import { DistrictFormDataSchema, DistrictFormData } from '@/types/schemas';

export type { DistrictFormData };

interface DistrictFormProps {
  id?: string;
  initialData?: DistrictFormData | null;
  regions?: { id: string; label: string }[];
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: DistrictFormData) => void;
}

export default function DistrictForm({ id, initialData, regions = [], isPublished, onPublishedChange, onSave }: DistrictFormProps) {
  const [formData, setFormData] = useState<DistrictFormData>({
    name: '',
    title: '',
    region: '',
    regionLabel: '',
    capital: '',
    areaKm2: '',
    areaPercentage: '',
    authorName: '',
    villages: [],
    description: '',
    geography: '',
    images: [],
    isPublished: isPublished ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authorName: initialData.authorName || '',
        isPublished: isPublished ?? initialData.isPublished ?? true
      });
    } else {
      setFormData({
        name: '',
        title: '',
        region: '',
        regionLabel: '',
        capital: '',
        areaKm2: '',
        areaPercentage: '',
        authorName: '',
        villages: [],
        description: '',
        geography: '',
        images: [],
        isPublished: isPublished ?? true
      });
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (isPublished !== undefined) {
      setFormData(prev => ({ ...prev, isPublished }));
    }
  }, [isPublished]);

  const handleFieldChange = (field: keyof DistrictFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = DistrictFormDataSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const fieldName = String(issue.path[0]);
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSave({
      ...result.data,
      authorName: result.data.authorName?.trim() || 'فريق توثيق بوابة أبين'
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="اسم المديرية"
        type="text"
        required
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        error={errors.name}
        placeholder="مثال: مديرية خنفر، مديرية زنجبار..."
      />

      <AdminInput
        label="الصفة والرمزية الشارحة"
        type="text"
        required
        value={formData.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        error={errors.title}
        placeholder="مثال: قلب الدلتا ومجمع الزراعة الأبينية..."
      />

      <AdminInput
        label="اسم الكاتب / الباحث التوثيقي"
        type="text"
        value={formData.authorName || ''}
        onChange={(e) => handleFieldChange('authorName', e.target.value)}
        error={errors.authorName}
        placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
      />

      {/* MEDIA UPLOAD SECTION - Left side column */}
      <div className="order-first md:order-last md:col-start-2 md:row-start-1 md:row-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 h-fit">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
            صور ومرفقات المديرية
            <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
              (الحد الأقصى 10 صور)
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload 
                folderName="abyan-portal/districts"
                key={`img-${index}`}
                label={index === 0 ? "الوسائط الرئيسية (الغلاف)" : `صورة إضافية ${index}`}
                value={imgUrl}
                accept="image/*,video/*,audio/*"
                onChange={(_, previewUrl) => {
                  const newImages = [...(formData.images || [])];
                  if (!previewUrl) {
                    newImages.splice(index, 1);
                  } else {
                    newImages[index] = previewUrl;
                  }
                  handleFieldChange('images', newImages);
                }}
              />
            ))}
            {(!formData.images || formData.images.length < 10) && (
              <AdminMediaUpload 
                folderName="abyan-portal/districts"
                key={`new-img-${formData.images?.length || 0}`}
                label={`إضافة صورة ${(formData.images?.length || 0) + 1}`}
                value=""
                accept="image/*,video/*,audio/*"
                onChange={(_, previewUrl) => {
                  if (previewUrl) {
                    handleFieldChange('images', [...(formData.images || []), previewUrl]);
                  }
                }}
              />
            )}
          </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminSelect
            label="النطاق الجغرافي / التقسيم العُرفي"
            options={regions?.map((region) => ({
              value: region.id,
              label: region.label,
            })) || []}
            value={formData.region}
            onChange={(value) => {
              const selectedRegion = regions?.find(r => r.id === value);
              setFormData(prev => ({ 
                ...prev, 
                region: value,
                regionLabel: selectedRegion ? selectedRegion.label : prev.regionLabel
              }));
              if (errors.region) {
                setErrors(prev => {
                  const next = { ...prev };
                  delete next.region;
                  return next;
                });
              }
            }}
            placeholder="اختر النطاق الجغرافي..."
            error={errors.region}
            allowCustom={false}
          />

          <AdminInput
            label="المركز الإداري للمديرية"
            type="text"
            required
            value={formData.capital}
            onChange={(e) => handleFieldChange('capital', e.target.value)}
            error={errors.capital}
            placeholder="مثال: جعار، زنجبار، لودر..."
          />
        </div>

      <AdminInput
        label="المساحة التقريبية (كم²)"
        type="text"
        required
        value={formData.areaKm2}
        onChange={(e) => handleFieldChange('areaKm2', e.target.value)}
        error={errors.areaKm2}
        placeholder="مثال: 2,145 كم²..."
      />

      <AdminInput
        label="النسبة المئوية من مساحة المحافظة"
        type="text"
        required
        value={formData.areaPercentage}
        onChange={(e) => handleFieldChange('areaPercentage', e.target.value)}
        error={errors.areaPercentage}
        placeholder="مثال: 10%..."
      />

      <AdminTagsInput 
        label="أبرز القرى والبلدات والمناطق بالمديرية"
        required
        tags={formData.villages}
        onChange={(tags) => handleFieldChange('villages', tags)}
        error={errors.villages}
      />

      <AdminRichTextEditor
        label="التضاريس والموقع الجغرافي"
        required
        value={formData.geography}
        onChange={(geography) => handleFieldChange('geography', geography)}
        error={errors.geography}
        placeholder="صف الحدود والتضاريس والمناخ الجغرافي للمديرية..."
        containerClassName="md:col-span-2"
      />

      <AdminRichTextEditor
        label="الشرح التوثيقي والتاريخي للمديرية"
        required
        value={formData.description}
        onChange={(description) => handleFieldChange('description', description)}
        error={errors.description}
        placeholder="اكتب التوثيق التاريخي، الدور الوطني والمكون الاجتماعي للمديرية..."
        containerClassName="md:col-span-2 mt-2"
      />

      <AdminSourcesInput
        sources={formData.sources || []}
        onChange={(sources) => handleFieldChange('sources', sources)}
        containerClassName="md:col-span-2 mt-2"
      />
    </form>
  );
}
