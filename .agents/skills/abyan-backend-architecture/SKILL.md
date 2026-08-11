---
name: abyan-backend-architecture
description: معايير وموجهات بناء الواجهة الخلفية (Backend) لمنصة أبين باستخدام NestJS و MongoDB. يجب الالتزام الصارم بهذا الموجه عند برمجة أي كود خلفي.
---
# تعليمات وقواعد بناء الواجهة الخلفية لمنصة أبين (Abyan Backend Guidelines)

هذه المهارة (Skill) هي الدستور الأساسي لبناء وتطوير الـ Backend لمنصة أبين. يُمنع تجاوز هذه القواعد.

## 🏗️ الهيكلية المعمارية الأساسية (Core Architecture)
1. **النمط النمطي (Modular Pattern):** يجب أن يُبنى كل كيان/قسم كـ Module مستقل (مثال: `PioneersModule`). كل Module يجب أن يحتوي حصرياً على:
   - `[Entity].module.ts`: لتجميع المكونات.
   - `[Entity].controller.ts`: لمعالجة طلبات الـ HTTP وتوجيهها (Routing).
   - `[Entity].service.ts`: لاحتواء منطق الأعمال (Business Logic) الثقيل.
   - `schemas/[entity].schema.ts`: لتعريف مخطط Mongoose.
   - `dto/`: مجلد لتعريف كلاسات Data Transfer Objects باستخدام `class-validator` و `class-transformer`.

## ✅ ما يجب أن تفعله دائماً (Strictly DO)
1. **التحقق الصارم (Strict Validation):** جميع الـ DTOs يجب أن تُبنى بعناية فائقة باستخدام ديكورات `class-validator` (مثل `@IsString()`, `@IsOptional()`). الـ Payload القادم يجب أن يكون آمناً ومفلوعاً (Sanitized).
2. **فصل المسؤوليات (Separation of Concerns):** الـ Controller وظيفته فقط استقبال الطلب، التحقق منه، وتمريره للـ Service. يُمنع كتابة أي منطق قاعدة بيانات (Mongoose queries) داخل الـ Controller.
3. **ترتيب ونظافة الكود (Clean Code):** استخدام الحقن الصحيح (Dependency Injection) عبر الـ Constructor. الكود يجب أن يكون منظماً، مكتوباً بـ TypeScript صارم (Strict Typing).
4. **استخدام التشفير والأمان:** يجب دائماً تشفير أي بيانات حساسة (مثل كلمة مرور الـ Admin) باستخدام `bcrypt` قبل الحفظ.

## ⛔ ما يجب أن تتجنبه منعاً باتاً (Strictly AVOID)
1. **المنع الصارم للمنطق المباشر في المتحكمات (No DB Logic in Controllers):** يُمنع تماماً استدعاء دوال `Model.find()` وما شابهها مباشرة داخل الـ Controller.
2. **يُمنع تسريب البيانات (No Data Leaking):** يُمنع إرجاع كائنات `document` الأصلية الخاصة بـ Mongoose مباشرة إلى العميل (استخدم `.lean()` إذا تطلب الأمر، أو قم بتجريد الحقول الداخلية مثل `__v` و `password` قبل الإرجاع).
3. **يُمنع تجاوز التحقق (Never Bypass Validation):** لا تستقبل `any` أو `Object` عادي في دوال الـ POST/PUT. يجب دائماً استخدام الـ DTOs المعرفة.
4. **يُمنع الكود المتشابك (No Spaghetti Code):** حافظ على الدوال قصيرة وتؤدي غرضاً واحداً (Single Responsibility Principle).
5. **المنع المطلق للأنواع المبهمة (Strict No `any` / `as` / `unknown`):** يُحظر تماماً استخدام `any` أو `unknown` أو تجاوز الأنواع باستخدام `as any`. يجب دائماً تعريف واجهات (Interfaces) صريحة (مثل `RequestUser`, `JwtPayload`) واستخدام الـ DTOs.
6. **هيكل الاستجابة الموحد (Unified Response Object):** لا تقم بإرجاع استجابات مخصصة من الـ Controllers. النظام يعتمد على `ResponseInterceptor` عالمي يُغلف أي إرجاع ناجح بصيغة `{ success: true, data: ..., message: ... }`.
7. **هيكل الأخطاء الموحد (Unified Exception Handling):** لا ترجع رسائل خطأ مخصصة بصيغة يدوية. النظام يعتمد على `HttpExceptionFilter` عالمي يلتقط أخطاء `HttpException` أو `class-validator` ويُغلفها بصيغة `{ success: false, message: ..., errors: [...] }`.
