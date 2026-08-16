import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import AdminMediaUpload from '../form-fields/AdminMediaUpload';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import AdminSourcesInput from '../form-fields/AdminSourcesInput';
import { PioneerFormDataSchema, PioneerFormData } from '@/types/schemas';
import { AdminDistrict } from '@/types/admin.types';

export type { PioneerFormData };

interface PioneerFormProps {
  id?: string;
  initialData?: PioneerFormData | null;
  categories: string[];
  districts?: AdminDistrict[];
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: PioneerFormData) => void;
}

export default function PioneerForm({ id, initialData, categories, districts = [], isPublished, onPublishedChange, onSave }: PioneerFormProps) {
  const [formData, setFormData] = useState<PioneerFormData>({
    name: '',
    title: '',
    category: '',
    origin: '',
    authorName: '',
    sourceName: '',
    sourceUrl: '',
    sources: [],
    startYear: '',
    endYear: '',
    biography: '',
    quote: '',
    birthDate: '',
    isPublished: isPublished ?? true,
    achievements: [],
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedVillageName, setSelectedVillageName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        quote: '',
        ...initialData,
        authorName: initialData.authorName || '',
        images: initialData.images || [],
        isPublished: isPublished ?? initialData.isPublished ?? true
      });
      if (initialData.origin) {
        const parts = initialData.origin.split(' - ');
        setSelectedDistrictName(parts[0] || '');
        setSelectedVillageName(parts[1] || '');
      } else {
        setSelectedDistrictName('');
        setSelectedVillageName('');
      }
    } else {
      setFormData({
        name: '',
        title: '',
        category: '',
        origin: '',
        authorName: '',
        startYear: '',
        endYear: '',
        biography: '',
        quote: '',
        birthDate: '',
        deathDate: '',
        isPublished: isPublished ?? true,
        images: [],
        achievements: []
      });
      setSelectedDistrictName('');
      setSelectedVillageName('');
    }
  }, [initialData, isPublished]);

  useEffect(() => {
    const dName = selectedDistrictName.trim();
    const vName = selectedVillageName.trim();
    if (dName && vName) {
      handleFieldChange('origin', `${dName} - ${vName}`);
    } else if (dName) {
      handleFieldChange('origin', dName);
    } else {
      handleFieldChange('origin', '');
    }
  }, [selectedDistrictName, selectedVillageName]);

  const handleFieldChange = (field: keyof PioneerFormData, value: any) => {
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
    const result = PioneerFormDataSchema.safeParse(formData);
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
      const finalData: PioneerFormData = {
        ...formData,
        authorName: formData.authorName?.trim() || 'فريق توثيق بوابة أبين'
      };
      onSave(finalData);
    }
  };

  const districtOptions = districts.map(d => ({ value: d.name, label: d.name }));
  const selectedDistrictObj = districts.find(d => d.name === selectedDistrictName);
  const villageOptions = selectedDistrictObj 
    ? selectedDistrictObj.villages.map(v => ({ value: v, label: v }))
    : [];

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* RIGHT COLUMN: ALL DETAILS */}
        <div className="space-y-4">
          <AdminInput
            label="اسم الشخصية"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={errors.name}
            placeholder="مثال: سالم ربيع علي..."
          />

          <AdminInput
            label="اللقب أو الصفة"
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={errors.title}
            placeholder="مثال: رئيس جمهورية سابق..."
          />

          <AdminInput
            label="اسم الكاتب / الباحث التوثيقي"
            type="text"
            value={formData.authorName || ''}
            onChange={(e) => handleFieldChange('authorName', e.target.value)}
            error={errors.authorName}
            placeholder="اختياري - افتراضياً: فريق توثيق بوابة أبين"
          />

          <AdminSelect
            label="الفئة / التصنيف"
            required
            options={categories.map(c => ({ value: c, label: c }))}
            value={formData.category}
            onChange={(val) => handleFieldChange('category', val)}
            error={errors.category}
            placeholder="اختر الفئة..."
            allowCustom={false}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="تاريخ الميلاد"
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => handleFieldChange('birthDate', e.target.value)}
              error={errors.birthDate}
            />

            <AdminInput
              label="تاريخ الوفاة (اختياري)"
              type="date"
              value={formData.deathDate || ''}
              onChange={(e) => handleFieldChange('deathDate', e.target.value)}
              error={errors.deathDate}
            />
          </div>

          <AdminTagsInput 
            label="أهم الإنجازات"
            required
            tags={formData.achievements}
            onChange={(tags) => handleFieldChange('achievements', tags)}
            error={errors.achievements as string}
          />

          <AdminInput
            label="مقولة أو اقتباس شهير (اختياري)"
            type="text"
            value={formData.quote}
            onChange={(e) => handleFieldChange('quote', e.target.value)}
            error={errors.quote}
            placeholder="مثال: من أقوال الشخصية..."
          />
        </div>

        {/* LEFT COLUMN: MEDIA UPLOAD ONLY */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4 sticky top-4">
          <label className="block text-sm font-abyan-title text-slate-700 font-bold mb-1">
            صور الشخصية
            <span className="block text-xs font-abyan-body text-slate-500 font-normal mt-1">
              (الحد الأقصى 10 صور)
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4">
            {(formData.images || []).map((imgUrl, index) => (
              <AdminMediaUpload 
                folderName="abyan-portal/pioneers"
                key={`img-${index}`}
                label={index === 0 ? "الصورة الشخصية الرئيسية (الغلاف)" : `صورة إضافية ${index}`}
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
                folderName="abyan-portal/pioneers"
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

        {/* FULL WIDTH: BIOGRAPHY & SOURCES */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <AdminParagraphsInput
            label="السيرة الذاتية و التفاصيل (فقرات موثقة)"
            required
            value={formData.biography}
            onChange={(val) => handleFieldChange('biography', val)}
            error={errors.biography}
            placeholder="اكتب تفاصيل السيرة هنا..."
            containerClassName="mt-2"
          />

          <AdminSourcesInput
            sources={formData.sources || []}
            onChange={(sources) => handleFieldChange('sources', sources)}
            containerClassName="mt-2"
          />
        </div>
      </div>
    </form>
  );
}
