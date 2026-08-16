import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import { ArchiveItemFormDataSchema, ArchiveItemFormData } from '@/types/schemas';
import { AdminDistrict } from '@/types/admin.types';

export type { ArchiveItemFormData };

interface ArchiveItemFormProps {
  id?: string;
  initialData?: ArchiveItemFormData | null;
  categories?: { label: string, value: string }[];
  districts?: AdminDistrict[];
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: ArchiveItemFormData) => void;
}

export default function ArchiveItemForm({ id, initialData, categories = [], districts = [], isPublished, onPublishedChange, onSave }: ArchiveItemFormProps) {
  const [formData, setFormData] = useState<ArchiveItemFormData>({
    title: '',
    categoryLabel: '',
    year: '',
    location: '',
    authorName: '',
    description: '',
    images: [],
    isPublished: isPublished ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedVillageName, setSelectedVillageName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authorName: initialData.authorName || '',
        images: initialData.images || [],
        isPublished: isPublished ?? initialData.isPublished ?? true
      });
      if (initialData.location) {
        const parts = initialData.location.split(' - ');
        setSelectedDistrictName(parts[0] || '');
        setSelectedVillageName(parts[1] || '');
      } else {
        setSelectedDistrictName('');
        setSelectedVillageName('');
      }
    } else {
      setFormData({
        title: '',
        categoryLabel: '',
        year: '',
        location: '',
        authorName: '',
        description: '',
        images: [],
        isPublished: isPublished ?? true
      });
      setSelectedDistrictName('');
      setSelectedVillageName('');
    }
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (!initialData && !selectedDistrictName && !selectedVillageName) return;
    let loc = '';
    if (selectedDistrictName) loc += selectedDistrictName;
    if (selectedDistrictName && selectedVillageName) loc += ' - ' + selectedVillageName;
    setFormData(prev => ({ ...prev, location: loc }));
    if (errors.location) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.location;
        return next;
      });
    }
  }, [selectedDistrictName, selectedVillageName]);

  useEffect(() => {
    if (isPublished !== undefined) {
      setFormData(prev => ({ ...prev, isPublished }));
    }
  }, [isPublished]);

  const handleFieldChange = (field: keyof ArchiveItemFormData, value: any) => {
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
    let locationVal = formData.location;
    if (!locationVal && selectedDistrictName) {
      locationVal = selectedDistrictName + (selectedVillageName ? ' - ' + selectedVillageName : '');
    }
    const dataToValidate = { ...formData, location: locationVal };
    const result = ArchiveItemFormDataSchema.safeParse(dataToValidate);
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
    onSave(result.data);
  };

  const districtOptions = districts.map(d => ({ value: d.name, label: d.name }));
  const selectedDistrict = districts.find(d => d.name === selectedDistrictName);
  const villageOptions = selectedDistrict?.villages ? selectedDistrict.villages.map(v => ({ value: v, label: v })) : [];

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <AdminInput
        label="عنوان الوثيقة أو الصورة الأرشيفية"
        type="text"
        required
        value={formData.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        error={errors.title}
        placeholder="مثال: وثيقة إنشاء سد باتيس التاريخية..."
      />

      <AdminInput
        label="اسم الكاتب / الباحث التوثيقي"
        type="text"
        required
        value={formData.authorName || ''}
        onChange={(e) => handleFieldChange('authorName', e.target.value)}
        error={errors.authorName}
        placeholder="مثال: د. قاسم المحبشي"
      />

      <AdminSelect
        label="التصنيف الأرشيفي"
        required
        value={formData.categoryLabel}
        onChange={(categoryLabel) => handleFieldChange('categoryLabel', categoryLabel)}
        error={errors.categoryLabel}
        options={categories}
        placeholder="اختر أو اكتب التكتل الأرشيفي..."
      />

      {/* MEDIA UPLOAD SECTION - Left side column */}
      <div className="order-first md:order-last md:col-start-2 md:row-start-1 md:row-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 h-fit">
        <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
          مرفقات ووثائق الأرشيف
          <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
            (الحد الأقصى 5 ملفات)
          </span>
        </label>
        <div className="grid grid-cols-1 gap-4">
          {(formData.images || []).map((imgUrl, index) => (
            <AdminMediaUpload 
              folderName="abyan-portal/archive"
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
          {(!formData.images || formData.images.length < 5) && (
            <AdminMediaUpload 
              folderName="abyan-portal/archive"
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

      <AdminInput
        label="سنة التوثيق"
        type="text"
        required
        value={formData.year}
        onChange={(e) => handleFieldChange('year', e.target.value)}
        error={errors.year}
        placeholder="مثال: 1954م، أو القرن الثامن عشر..."
      />

      <AdminSelect
        label="المديرية"
        required
        value={selectedDistrictName}
        onChange={(val) => {
          setSelectedDistrictName(val);
          setSelectedVillageName('');
        }}
        error={errors.location}
        options={districtOptions}
        placeholder="اختر المديرية..."
      />

      <AdminSelect
        label="القرية / المنطقة"
        value={selectedVillageName}
        onChange={setSelectedVillageName}
        options={villageOptions}
        placeholder="اختر القرية أو المنطقة..."
        disabled={!selectedDistrictName || villageOptions.length === 0}
      />

      <AdminParagraphsInput
        label="الشرح والقيد التوثيقي للأرشيف (فقرات)"
        required
        value={formData.description}
        onChange={(description) => handleFieldChange('description', description)}
        error={errors.description}
        placeholder="اكتب تفاصيل القيد، مصدر الوثيقة، والأهمية الوطنية..."
        containerClassName="md:col-span-2 mt-2"
      />
    </form>
  );
}
