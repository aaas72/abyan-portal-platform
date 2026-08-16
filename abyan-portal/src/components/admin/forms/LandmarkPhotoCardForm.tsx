import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminTextarea from '../form-fields/AdminTextarea';
import AdminSelect from '../form-fields/AdminSelect';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import AdminSourcesInput from '../form-fields/AdminSourcesInput';
import { LandmarkPhotoCardFormDataSchema, LandmarkPhotoCardFormData } from '@/types/schemas';
import { AdminDistrict } from '@/types/admin.types';

export type { LandmarkPhotoCardFormData };

interface LandmarkPhotoCardFormProps {
  id?: string;
  initialData?: LandmarkPhotoCardFormData | null;
  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;
  categories: { value: string; label: string }[];
  districts?: AdminDistrict[];
  onSave: (data: LandmarkPhotoCardFormData) => void;
}

export default function LandmarkPhotoCardForm({ id, initialData, isActive, onActiveChange, categories, districts = [], onSave }: LandmarkPhotoCardFormProps) {
  const [formData, setFormData] = useState<LandmarkPhotoCardFormData>({
    category: '',
    title: '',
    tag: '',
    authorName: '',
    images: [],
    location: '',
    startYear: '',
    endYear: '',
    description: '',
    isActive: isActive ?? true
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
        isActive: isActive ?? initialData.isActive ?? true
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
        category: '',
        title: '',
        tag: '',
        authorName: '',
        images: [],
        location: '',
        startYear: '',
        endYear: '',
        description: '',
        isActive: isActive ?? true
      });
      setSelectedDistrictName('');
      setSelectedVillageName('');
    }
  }, [initialData, isActive]);

  useEffect(() => {
    const dName = selectedDistrictName.trim();
    const vName = selectedVillageName.trim();
    if (dName && vName) {
      handleFieldChange('location', `${dName} - ${vName}`);
    } else if (dName) {
      handleFieldChange('location', dName);
    } else {
      handleFieldChange('location', '');
    }
  }, [selectedDistrictName, selectedVillageName]);

  const handleFieldChange = (field: keyof LandmarkPhotoCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const result = LandmarkPhotoCardFormDataSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
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
      onSave(formData);
    }
  };

  const districtOptions = districts.map(d => ({ value: d.name, label: d.name }));
  const selectedDistrictObj = districts.find(d => d.name === selectedDistrictName);
  const villageOptions = selectedDistrictObj 
    ? selectedDistrictObj.villages.map(v => ({ value: v, label: v }))
    : [];

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MEDIA UPLOAD SECTION - TAKES LEFT COLUMN ON DESKTOP */}
        <div className="md:col-start-1 md:row-start-1 md:row-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-2">
            صور المعلم وتوثيقاته
            <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">(يمكنك رفع صور للمعلم - الحد الأقصى 5)</span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload 
                folderName="abyan-portal/landmarks"
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
                folderName="abyan-portal/landmarks"
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

        {/* DETAILS SECTION - TAKES RIGHT COLUMN */}
        <AdminSelect
          label="فئة المعلم"
          required
          options={categories}
          placeholder="اختر فئة المعلم..."
          allowCustom={false}
          value={formData.category}
          onChange={(val) => handleFieldChange('category', val)}
          error={errors.category}
        />

        <AdminInput
          label="اسم المعلم"
          required
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          error={errors.title}
          placeholder="مثال: حصن القعيطي"
        />

        <AdminInput
          label="اسم الكاتب / الباحث التوثيقي"
          value={formData.authorName || ''}
          onChange={(e) => handleFieldChange('authorName', e.target.value)}
          error={errors.authorName}
          placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
        />

        <AdminInput
          label="النوع (Tag)"
          required
          value={formData.tag}
          onChange={(e) => handleFieldChange('tag', e.target.value)}
          error={errors.tag}
          placeholder="مثال: حصن تاريخي"
        />

        <AdminSelect
          label="المديرية"
          required
          options={districtOptions}
          value={selectedDistrictName}
          onChange={(val) => setSelectedDistrictName(val)}
          placeholder="اختر المديرية..."
        />

        <AdminSelect
          label="القرية / المنطقة"
          value={selectedVillageName}
          options={villageOptions}
          onChange={(val) => setSelectedVillageName(val)}
          placeholder="اختر القرية أو المنطقة..."
          disabled={!selectedDistrictName || villageOptions.length === 0}
        />

        <AdminInput
          label="سنة البداية"
          type="text"
          value={formData.startYear}
          onChange={(e) => handleFieldChange('startYear', e.target.value)}
          error={errors.startYear}
          placeholder="مثال: 1990"
        />

        <AdminInput
          label="سنة النهاية"
          type="text"
          value={formData.endYear}
          onChange={(e) => handleFieldChange('endYear', e.target.value)}
          error={errors.endYear}
          placeholder="مثال: 2020"
        />

        <AdminTextarea
          label="وصف المعلم"
          required
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          error={errors.description}
          placeholder="اكتب وصف المعلم هنا..."
          containerClassName="md:col-span-2"
          rows={5}
        />

        <AdminSourcesInput
          sources={formData.sources || []}
          onChange={(sources) => handleFieldChange('sources', sources)}
          containerClassName="md:col-span-2 mt-2"
        />
      </div>
    </form>
  );
}
