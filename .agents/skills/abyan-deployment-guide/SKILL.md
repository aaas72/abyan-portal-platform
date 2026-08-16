---
name: abyan-deployment-guide
description: معايير النشر وتهيئة بيئة الاستضافة (Deployment & DevOps) لمنصة بوابة أبين الثقافية، وتحديداً على منصة Render وتجهيز متغيرات البيئة بشكل شامل.
---

# الدليل الشامل لإعداد ونشر بوابة أبين (Abyan Complete Deployment Guide)

تعتبر هذه المهارة المرجع الأساسي والكامل لإعداد بيئة الاستضافة (Hosting) والنشر (Deployment) لمنصة بوابة أبين الثقافية على خدمة **Render** لضمان عمل الواجهة والخلفية معاً بسلاسة تامة ودون أخطاء اتصال.

## 🏗️ 1. إعداد ونشر الواجهة الخلفية (Backend - NestJS)

عند إعداد مشروع الواجهة الخلفية كـ (Web Service) في Render، يجب الالتزام بالتالي:

### أ. أوامر البناء والتشغيل (Build & Start Commands)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod` (مهم جداً استخدام `start:prod` بدلاً من `start:dev` في بيئة الإنتاج).

### ب. متغيرات البيئة الأساسية (Environment Variables)
يجب تعيين المتغيرات التالية بشكل دقيق لضمان أمان البيانات والسماح بالاتصال:
1. `NODE_ENV` = `production`
2. `PORT` = (يُفضل تركه فارغاً أو تحديده، Render يقوم بتحديده تلقائياً).
3. `MONGO_URI` = رابط الاتصال بقاعدة بيانات MongoDB (مثل MongoDB Atlas).
4. `JWT_SECRET` = مفتاح تشفير الجلسات الآمن (كلمة مرور معقدة جداً).
5. `JWT_EXPIRES_IN` = مدة صلاحية الجلسة (مثال: `7d` لسبعة أيام).
6. **[حرج جداً]** `CORS_ORIGINS` = الرابط الحي الفعلي للواجهة الأمامية (مثال: `https://abyan-portal.onrender.com`). يُمنع وضع شرطة مائلة `/` في نهايته. وبدونه سترفض الخلفية جميع الطلبات.

---

## 🎨 2. إعداد ونشر الواجهة الأمامية (Frontend - Next.js)

عند إعداد مشروع الواجهة الأمامية كـ (Web Service) مستقل في Render:

### أ. أوامر البناء والتشغيل (Build & Start Commands)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`

### ب. متغيرات البيئة الأساسية (Environment Variables)
1. `NODE_ENV` = `production`
2. **[حرج جداً]** `NEXT_PUBLIC_API_URL` = الرابط الحي للخلفية بدون الشرطة المائلة `/api` (مثال: `https://abyan-backend.onrender.com`).
   *ملاحظة هامة:* إذا نسيت إضافته، سيقوم الكود بمحاولة الاتصال بـ `localhost:4000` وسيفشل الموقع تماماً منتجاً رسالة (Network Error).

---

## 🔐 3. بروتوكولات الأمان والمصادقة (Cross-Site Authentication)
بما أن الواجهة تعمل على رابط (Domain) مختلف تماماً عن الخلفية، فإننا نتعامل مع طلبات من نوع (Cross-Site). لذلك يجب ضمان التالي في كود تسجيل الدخول (Auth Controller):
- الكوكيز التي تحمل الـ `access_token` **يجب** أن تحتوي على الإعدادات التالية في الإنتاج:
  ```typescript
  {
    httpOnly: true,
    secure: true,           // إلزامي للعمل مع https
    sameSite: 'none',       // إلزامي للسماح للكوكي بالانتقال بين دومين الواجهة ودومين الخلفية
    maxAge: 7 * 24 * 60 * 60 * 1000 // مدة البقاء
  }
  ```
استخدام `sameSite: 'lax'` سيتسبب في حظر تسجيل الدخول من قِبل المتصفح.

---

## 🔄 4. منهجية التحديث المستمر (CI/CD Workflow & Redeploys)
1. **التحديث التلقائي:** منصة Render متصلة بـ GitHub. أي أمر `git push origin main` يؤدي تلقائياً لإعادة بناء الموقع.
2. **التحديث اليدوي (Manual Deploy):**
   - يُلزم القيام به **فقط** عندما تقوم بتعديل (متغير بيئة Environment Variable) مثل تعديل `NEXT_PUBLIC_API_URL`.
   - في الواجهة الأمامية (Next.js)، المتغيرات تبدأ بـ `NEXT_PUBLIC` ويتم حرقها في الكود أثناء البناء، لذا يجب اختيار **Clear build cache & deploy** يدوياً لضمان دمج الرابط الجديد.

## التزام المطور / الذكاء الاصطناعي
يُمنع اقتراح تعديلات معقدة في الكود عند تلقي خطأ `AxiosError: Network Error` أو مشكلة في تسجيل الدخول الحي. يجب التوجه فوراً للمطالبة بمراجعة إعدادات النشر هذه (CORS و NEXT_PUBLIC_API_URL و sameSite).
