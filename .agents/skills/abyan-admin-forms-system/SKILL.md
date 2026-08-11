---
name: abyan-admin-forms-system
description: معايير وموجهات تصميم وإنشاء نماذج التحكم والإدخال (Admin Forms System) في منصة أبين الثقافية، مع ضمان المطابقة الهيكلية 100% لبيانات مجلد src/data وتطبيق التحقق الفوري بـ Zod والستايل الفاخر بدون أي إيموجيهات أو حدود مزدوجة.
---

# معايير وقواعد تصميم وإنشاء نماذج التحكم والإدخال (Abyan Admin Forms Architecture)

## 📌 الهدف والغاية
تحديد المعايير القياسية والقواعد الصارمة لإنشاء وتطوير كافة نماذج الإدخال والتحكم (Admin Forms) في منصة أبين الثقافية، لضمان اتساق التصميم البصري، والمطابقة التامة لهياكل البيانات في `src/data` وتوفير أفضل تجربة إدخال.

---

## ⛔ القواعد الذهبية الصارمة للنماذج (Strict Form Rules)

1. **المطابقة الصارمة لهياكل البيانات (`Form Data Structure Alignment Rule`)**:
   - قبل تصميم أو التعديل على أي نموذج (Form)، يجب دائماً الرجوع كلياً إلى أنواع البيانات والمخططات في `src/data` وتطابق حقول النموذج كلياً مع المخطط المعتمد.

2. **منع الأيقونات والإيموجيهات نهائياً (`Strict No Emojis / No Icons / No Symbols Rule`)**:
   - يُمنع استخدام أي أيقونات، رموز تعبيرية (إيموجي)، أو رموز إضافية مثل `+` أو `#` داخل التسميات والأزرار، وتقتصر كافة الأزرار والتسميات على النصوص العربية الصافية (مثل: `إضافة فقرة جديدة` بدلاً من `+ إضافة فقرة جديدة` و`الفقرة 1` بدلاً من `الفقرة #1`).

3. **النمط الفاتح والحدود الصافية النقية (`Light Theme & Pure Borders`)**:
   - لا توجد حدود مزدوجة أو ظلال ثقيلة (`shadow-none border-none`).
   - الإطارات بسيطة وناعمة (`border border-slate-200 rounded-lg` أو `rounded-xl`).
   - التركيز والتفاعل (`focus:bg-slate-50/50 focus:border-[#10b981]`).

4. **منع استخدام دوال التنبيه الافتراضية (Strict No `alert` Rule)**:
   - يُمنع منعاً باتاً استخدام `alert()` أو `confirm()` الافتراضية لعرض رسائل النجاح أو الفشل أو التأكيد.
   - يجب دائماً استيراد واستخدام `useToast` من `@/contexts/ToastContext` لعرض تنبيهات العمليات المنفذة (مثل `toast.success("تم الحفظ")` و `toast.error("حدث خطأ")`).

4. **نظام التحقق الشامل وإبراز الأخطاء (`Zod Validation System`)**:
   - استخدام `Zod` للتحقق من البيانات (`safeParse`).
   - الحقول المطلوبة تمتاز بوجود النجمة الحمراء (`*`) بجانب العنوان (`text-red-500 mr-1`).
   - عند حدوث خطأ في حقل، يتم صبغ إطار الحقل بالأحمر الصريح (`border-red-500 bg-red-50/10`) وعرض رسالة الخطأ النصية تحته مباشرة (`text-xs text-red-500 font-abyan-body mt-0.5`).
   - إزالة الخطأ تلقائياً فور كتابة المستخدم وتعديل الحقل.

---

## 🛠️ المكونات المعيارية لنظام النماذج (`Admin Form Fields Library`)

1. **الحقل النصي القياسي (`AdminInput`)**:
   - للحقول النصية والتواريخ والأرقام.
   - يستقبل `label, value, onChange, error, required, placeholder, containerClassName`.

2. **حقل التحديد المنسدل الذكي (`AdminSelect`)**:
   - للقوائم المنسدلة (مثل الفئات، المديريات، الحقب).
   - يمتاز بارتفاع محدد وقابل للتمرير (`max-h-48 overflow-y-auto custom-thin-scrollbar`).
   - بدون أسهم المتصفح الافتراضية، وبدون تلميحات سوداء.

3. **محرر الفقرات الموثقة (`AdminParagraphsInput`)**:
   - للسير والتفاصيل الوثائقية الممتدة.
   - يعتمد نظام كتل الفقرات المستقلة (`Dynamic Paragraph Blocks`) لمنع دمج النصوص، مع تذييل الأزرار النصية الصافية (`إضافة فقرة جديدة` / `حذف الفقرة`).

4. **حقل الوسوم والتسلسلات (`AdminTagsInput`)**:
   - للإنجازات، المحاصيل، المعالم، والنقاط.
   - يعرض العناصر المضافة كقائمة نصوص صافية فاخرة باللون الأزرق السماوي (`text-sky-600 font-abyan-body`) ومفصولة بنقاط متناسقة (`•`).

5. **مكون رفع ومعاينة الصور (`AdminImageUpload`)**:
   - يوفر معاينة بصرية فورية للصورة المرفوعة (`Image Preview`).
   - يتضمن أزرار تغيير وإزالة نصية صافية (`تغيير الصورة` | `حذف الصورة`).

6. **مفتاح النشر والمسودة (`AdminToggle`)**:
   - يتواجد في ترويسة الصفحة/اللوحة للتحكم في حالة النشر مباشرة.

---

## 📐 الهيكل القياسي المعتمد لأي نموذج (`Form Component Structure Template`)

```tsx
import { useState, useEffect } from 'react';
import AdminInput from '../form-fields/AdminInput';
import AdminSelect from '../form-fields/AdminSelect';
import AdminTagsInput from '../form-fields/AdminTagsInput';
import AdminParagraphsInput from '../form-fields/AdminParagraphsInput';
import AdminImageUpload from '../form-fields/AdminImageUpload';
import { TargetFormDataSchema, TargetFormData } from '@/types/schemas';

export type { TargetFormData };

interface TargetFormProps {
  id?: string;
  initialData?: TargetFormData | null;
  isPublished?: boolean;
  onPublishedChange?: (checked: boolean) => void;
  onSave: (data: TargetFormData) => void;
}

export default function TargetForm({ id, initialData, isPublished, onPublishedChange, onSave }: TargetFormProps) {
  const [formData, setFormData] = useState<TargetFormData>({
    /* Default State Properties Here... */
    isPublished: isPublished ?? true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isPublished: isPublished ?? initialData.isPublished ?? true
      });
    } else {
      setFormData({
        /* Default State Properties Here... */
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

  const handleFieldChange = (field: keyof TargetFormData, value: any) => {
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
    const result = TargetFormDataSchema.safeParse(formData);
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

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {/* Form Fields using Admin Form Fields Components */}
    </form>
  );
}
```

## ??? ????? ????? ??????? ????? ?????? ?????? (Multi-Upload & Single Display Rule)
1. **????? ??????? (Multi-Upload)**: ?? ???? ???? ????? ??? ?? ????? ??? \images: string[]\ ????? ???? **??? 5 ???** ??? ???? ???????? ???? \AdminMediaUpload\ ???? ??????.
2. **????? ?????? ??? ?????? (Strict First Image Only on Cards)**: ???? ???? ?????? (??? \FoodCard\, \UniversalCard\, \PioneerCard\) ??? ?? ???? ????? ?????? **?????? ?????? (\images[0]\)** ????? ???? ???? ?????? ????? ?? ???? ???????.
3. **??? ???? ????? (Slider in Modals)**: ???? ????? (?? ????) ??? ????? ?????? ???? ????? ???????? ???????? (\UnifiedMediaViewer\) ???????? ???? ???? ???? ?????? ?????.

## ?? ????? ?????? ????? (History Era Dates Rule)
- ????? ????????? (\HistoryEra\) ??? ?? ????? ??? ???? ?????? ???????? (\startYear\ ? \endYear\) ?? ???? ?????? ?????? ???????? ????? ?? ??? ??? ???? ?????? ?????? (\	imeframe\).
