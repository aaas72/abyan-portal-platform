---
name: three-layer-architecture
description: معيار الهيكلية الثلاثية ونظام التحميل الوهمي الهندسي المطابق 1-إلى-1 للصفحات بالمنصة (3-Layer Architecture & Dedicated 1-to-1 Blueprint Skeleton System)
---

# معيار الهيكلية الثلاثية (3-Layer Architecture) ونظام التحميل الوهمي المخصص

## 1. الهيكلية المعيارية للصفحات (3-Layer File Hierarchy)

### الطبقة الأولى (Page Layer - Sync Server Component):
- **المسار الرسمي**: `src/app/[feature]/page.tsx`
- **الدور**: مكون سيرفر مُزامن يعمل كغلاف رئيسي، يحتوي على تثبيت الـ Navbar والـ Footer الدائمين خارج نطاق التحميل، ويقوم بتغليف مكون `DataWrapper` داخل `<Suspense fallback={<FeaturePageSkeleton />}>`.
- **القواعد**: يُمنع إنشاء ملفات `loading.tsx` إطلاقاً، وتوضع مكونات السكيليتون الوهمي المخصصة في `Skeletons.tsx` واستدعاؤها داخل ملف `page.tsx`.

### الطبقة الثانية (Data Wrapper Layer - Async Server Component):
- **المسار الرسمي**: `src/app/[feature]/[Feature]DataWrapper.tsx`
- **الدور**: مكون سيرفر غير مُزامن يجلب البيانات من الـ Backend Service (`PortalService`) ويمررها كـ `initialData` إلى مكون العرض التفاعلي.

### الطبقة الثالثة (Client Component Layer):
- **المسار الرسمي**: `src/components/features/[feature]/[Feature]Client.tsx`
- **الدور**: مكون واجهة تفاعلي يحمل التوجيه `"use client"`، يحتوي على التفاعلية المباشرة، النواظر والنماذج، والفلترة باستخدام `useMemo`.
- **ملاحظة صارمة**: يُمنع منعاً باتاً إنشاء أو وضع مكونات UI داخل مجلد `src/app/`.

---

## 2. نظام المخططات الوهمية المخصصة (Dedicated 1-to-1 Blueprint Skeleton System)

1. **المطابقة التخطيطية الهيكلية (1-to-1 Blueprint Copy)**:
   - لكل صفحة بالمنصة مخطط وهمي مخصص (`LandmarksPageSkeleton`, `DistrictsPageSkeleton`, `PioneersPageSkeleton`, `CulturePageSkeleton`, `EconomyPageSkeleton`, `GalleryPageSkeleton`, `AboutPageSkeleton`, `HistoryPageSkeleton`) يعكس مكونات الصفحة الداخلية داخل `SmartContainer` بنفس الأبعاد والتقسيمات.

2. **النظافة والجماليات بدون حدود أو ظلال**:
   - جميع مكونات التحميل الوهمية بدون حدود (`border-none`) وبدون ظلال (`shadow-none`) وتعتمد المنحنيات الأساسية الناعمة (`rounded-2xl`, `rounded-3xl`, `rounded-full`).

3. **حركة وسريان الألوان السلسة (RTL Gradient Flow)**:
   - تدرج لوني انسيابي ناعم بين الأخضر الربيعي والأزرق السماوي بفاعلية الحركة (`animate-abyan-shimmer-rtl`).

4. **محاكاة النصوص الواقعية ودعم اتجاه RTL الأصلي**:
   - استخدام المكونات النصية الواقعية (`SkeletonTextLine`, `SkeletonParagraph`) ذات الأطوال المتدرجة والمحاذاة المباشرة بالاتجاه العربي (`dir="rtl"`).
