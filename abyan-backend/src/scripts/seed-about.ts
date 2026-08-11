import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abyan_db';

const AboutPillarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const AboutValueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const AboutScopeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  items: { type: [String], default: [] },
});

const AboutStatSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: String, required: true },
});

const AboutContentSchema = new mongoose.Schema(
  {
    pillars: { type: [AboutPillarSchema], default: [] },
    values: { type: [AboutValueSchema], default: [] },
    scopes: { type: [AboutScopeSchema], default: [] },
    stats: { type: [AboutStatSchema], default: [] },
  },
  { timestamps: true },
);

const AboutContent =
  mongoose.models.AboutContent ||
  mongoose.model('AboutContent', AboutContentSchema);

const aboutData = {
  pillars: [
    {
      title: 'صون التراث والشفاهيات والأدب',
      description:
        'توثيق ألحان الدان الأبيني الأصيل في الساحل والدلتا، زوامل يافع والمنطقة الوسطى، مهاجل الحصاد والسيول، وحكايات الآباء والأجداد الشفاهية.',
    },
    {
      title: 'التوثيق الجغرافي الشامل للمديريات الـ 11',
      description:
        'تقديم دليل جغرافي تفصيلي متوازن يشمل يافع أبين (رصد، سرار، سباح)، العاصمة والساحل (زنجبار، شقرة)، المنطقة الوسطى (لودر، مودية، الوضيع، دثينة، جيشان)، الدلتا (خنفر، جعار)، والشرقية (أحور، مكيراس).',
    },
    {
      title: 'الأرشيف التاريخي والبصري والمخطوطات',
      description:
        'حفظ الوثائق السلطانية والقبيلية القديمة، الصور التاريخية لحصن القارة، ميناء شقرة، عقبة ثرة، وسد باتيس في معرض ذاكرة أبين التفاعلي.',
    },
    {
      title: 'الوفاء لأعلام ورواد الفكر والإبداع',
      description:
        'إبراز سِيَر وأدوار كبار العلماء، الشعراء، المفكرين، القادة، والفرسان من جميع مديريات المحافظة الـ 11 دون استثناء.',
    },
  ],
  values: [
    {
      title: 'التوازن الجغرافي والعدالة التوثيقية',
      description:
        'إعطاء كافة مديريات أبين الـ 11 ومكوناتها الجغرافية والتاريخية حقها الكامل المتساوي دون التركيز على منطقة على حساب أخرى.',
    },
    {
      title: 'الاستقلالية والحياد الوطني',
      description:
        'مشروع وثائقي مستقل تماماً يُعنى بحفظ الذاكرة الوطنية والتراث الإنساني والجغرافي لمحافظة أبين ككل.',
    },
    {
      title: 'الدقة والأصالة التاريخية',
      description:
        'استناد محتوى المنصة على المصادر الشفاهية الأصيلة من كافة المناطق، الوثائق المكتوبة، والدراسات التاريخية المعتمدة.',
    },
    {
      title: 'الهوية الجغرافية الثلاثية الفاخرة',
      description:
        'الالتزام بالألوان التراثية لأبين (الأخضر الربيعي للدلتا، الأزرق السماوي للشواطئ والبحار، والرمادي الصخري لجبال يافع والكور وثرة).',
    },
  ],
  scopes: [
    {
      title: 'جغرافيا وتضاريس المديريات الـ 11',
      summary: 'توازن كامل بين الجبال والساحل والدلتا',
      items: [
        'يافع أبين: رصد، سَرار، وسِبَاح وقمم حصن القارة',
        'المنطقة الوسطى: لودر، مودية، الوضيع، وجيشان',
        'الساحل والعاصمة: زنجبار، شقرة، وأحور العريقة',
        'الدلتا الزراعية: خنفر، جعار، وسهل بنا وحسان',
      ],
    },
    {
      title: 'التراث الأدبي والشفاهي والفلكلور',
      summary: 'سجل الألحان والمساجلات الشعرية',
      items: [
        'زوامل وأشعار يافع والمنطقة الوسطى الشامخة',
        'فن الدان الأبيني الأصيل في زنجبار وشقرة',
        'مهاجل الفلاحين والبحارة بالدلتا والشواطئ',
        'رقصات الشرح الأبيني والهودون الشعبية',
      ],
    },
    {
      title: 'المعالم الأثرية والشواهد التاريخية',
      summary: 'حصون وأطواد وسدود المحافظة',
      items: [
        'حصن القارة التاريخي وقمم يافع الشاهقة',
        'عقبة ثرة العظيمة وجبال الكور المنيعة',
        'ميناء شقرة التاريخي وقصر السلطان الفضلي',
        'سد باتيس الهندسي وجبل خنفر المطل',
      ],
    },
  ],
  stats: [
    { number: '11', label: 'مديرية موثقة بالتساوي الكامل' },
    { number: '5', label: 'حقب تاريخية تعكس حضارة المحافظة' },
    { number: '100%', label: 'نمط فاتح وناصع بألوان أبين' },
    { number: '24/7', label: 'مكتبة معرفية متاحة للجميع' },
  ],
};

async function seedAbout() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear existing
    const deleteResult = await AboutContent.deleteMany({});
    console.log(
      `Cleared ${deleteResult.deletedCount} existing about content documents.`,
    );

    // Insert new
    const newAbout = new AboutContent(aboutData);
    await newAbout.save();
    console.log(`Successfully seeded About content!`);
  } catch (error) {
    console.error('Error seeding about data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedAbout();
