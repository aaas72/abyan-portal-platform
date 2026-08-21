import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivacyContent } from '../privacy/schemas/privacy.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const privacyModel = app.get<Model<PrivacyContent>>(getModelToken(PrivacyContent.name));

  const initialPrivacy = {
    intro: [
      {
        title: 'التزامنا الراسخ بخصوصية زوارنا والباحثين',
        description:
          'تضع "بوابة أبين الثقافية" خصوصية وأمان بيانات زوارها والباحثين والمهتمين في مقدمة أولوياتها الأخلاقية والمهنية. توضح هذه السياسة بشفافية تامة طبيعة البيانات المحدودة التي قد يتم التعامل معها وكيفية حمايتها وصونها.',
      },
    ],
    dataCollection: [
      {
        title: 'البيانات التي نجمعها عبر قنوات التواصل والمشاركة',
        description:
          'عند قيامك بالتواصل معنا عبر قنوات البريد الإلكتروني أو نموذج المشاركة في التوثيق، فإننا نحتفظ فقط بالمعلومات التي تقدمها طوعاً (مثل: الاسم، البريد الإلكتروني، والوثائق أو التراجم المرسلة) وذلك لغرض مراجعة وتوثيق المشاركة والتواصل معك بشأنها.',
      },
      {
        title: 'البيانات التقنية غير المعرِّفة للهوية الشخصية',
        description:
          'نقوم بتسجيل بيانات تصفح مجهولة الهوية بالكامل (مثل نوع المتصفح، الصفحات الأكثر زيارة، والمدة التقريبية للتصفح) عبر أنظمة تحليلات مجهولة ومجردة تماماً بهدف تحسين أداء المنصة وسرعة استجابة السيرفرات.',
      },
    ],
    usageAndProtection: [
      {
        title: 'عدم بيع أو مشاركة البيانات مع أي أطراف تجارية',
        description:
          'نؤكد بصورة قطعية أن بوابة أبين الثقافية منصة وطنية غير ربحية، ولا نقوم على الإطلاق ببيع، أو تأجير، أو مشاركة أي بيانات شخصية أو عناوين اتصال مع أي شركات إعلانية أو جهات خارجية.',
      },
      {
        title: 'بروتوكولات الأمان والتشفير الرقمي',
        description:
          'تعتمد المنصة أعلى معايير التشفير (HTTPS / TLS) لحماية كافة الاتصالات بين جهاز المستخدم وخوادمنا، وتطبيق سياسات حماية صارمة لمنع أي وصول غير مصرح به للبيانات المخزنة.',
      },
    ],
    cookiesAndAnalytics: [
      {
        title: 'ملفات تعريف الارتباط الضرورية (Cookies)',
        description:
          'تستخدم المنصة ملفات تعريف ارتباط وظيفية تقنية أساسية فقط لضمان عمل الواجهة وحفظ التفضيلات المؤقتة وتأمين جلسات لوحة التحكم، دون أي تتبع إعلاني خارجي.',
      },
      {
        title: 'حقوق المستخدم وحذف البيانات والتواصل',
        description:
          'يحق لأي مساهم أو باحث تواصل معنا طلب مراجعة أو تعديل أو حذف أي بيانات شخصية أو بريد إلكتروني تم تزويدنا به عبر مراسلتنا مباشرة على بريد إدارة البوابة.',
      },
    ],
  };

  await privacyModel.deleteMany({});
  await privacyModel.create(initialPrivacy);
  console.log('✅ Privacy Policy seeded successfully!');
  await app.close();
}

seed().catch(err => {
  console.error('❌ Error seeding privacy policy:', err);
  process.exit(1);
});
