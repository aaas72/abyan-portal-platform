# فاحص أبين الأمني الآلي

فاحص ثابت (static analysis) مخصّص لبنية هذا المشروع تحديداً: يفهم ديكوريتورات NestJS،
ونمط التصدير الساكن في Next.js، وطريقة التسجيل المستخدمة هنا — وهو ما لا تلتقطه الأدوات العامة.

## التشغيل

```bash
node security-audit/scan.mjs                 # فحص كامل + تقرير مقروء
node security-audit/scan.mjs --json          # مخرجات JSON للأنظمة الآلية
node security-audit/scan.mjs --skip-audit    # تخطّي npm audit (بدون إنترنت)
node security-audit/scan.mjs --fail-on high  # يُرجع خطأ إذا وُجدت ملاحظة عالية فأعلى
```

تُحفظ التقارير في `security-audit/reports/` (`latest.json` + نسخة مؤرّخة لكل تشغيل).

## مجموعات الفحص

| # | المجموعة | ماذا تفحص |
|---|----------|-----------|
| 1 | `secrets` | بيانات اعتماد ومفاتيح داخل الشيفرة، قوة `JWT_SECRET`، استثناء ملفات البيئة |
| 2 | `nest-guard-coverage` | يحلّل كل متحكم ويطابق كل مسار مع حرّاسه؛ يكشف `@Roles` بلا `@UseGuards` |
| 3 | `nest-brute-force` | تحديد معدّل المصادقة، تسريب رمز الاستعادة، الحساب الافتراضي |
| 4 | `bootstrap-hardening` | CORS، `trust proxy`، حد حجم الجسم، الإغلاق الرشيق، التوثيق |
| 5 | `logging-safety` | حقول حسّاسة غير منقّحة، حقن صيغ CSV، تدوير السجلات، تسريب الأخطاء |
| 6 | `injection-validation` | `@Body('x')` الخام، `$where`/`eval`، غياب `@MaxLength`، سياسة كلمات المرور |
| 7 | `frontend-security` | `dangerouslySetInnerHTML`، تخزين الرمز، معالجة 401، رؤوس الأمان/CSP |
| 8 | `performance` | استعلامات بلا ترقيم، `.lean()`، التخزين المؤقت، الضغط |
| 9 | `dependencies` + `tooling-gaps` | `npm audit` للمشروعين، تغطية الاختبارات، السكربتات المتناثرة |

## ضبط الضجيج

- **مسارات عامة مقصودة**: أضفها إلى `INTENTIONAL_PUBLIC` في أعلى `scan.mjs`.
  الفلسفة هنا أن كل مسار مفتوح يجب أن يكون قراراً موثّقاً لا سهواً.
- **إيجابيات كاذبة في الأسرار**: عدّل `ignoreValue` داخل `SECRET_RULES`.

## الدمج في CI

```yaml
- name: Security scan
  run: node security-audit/scan.mjs --fail-on high
```

يمنع هذا دمج أي تغيير يُدخل ثغرة عالية الخطورة.
