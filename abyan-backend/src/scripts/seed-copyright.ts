import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abyan_db';

const CopyrightItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String, required: false },
  items: { type: [String], default: [] },
});

const CopyrightContentSchema = new mongoose.Schema(
  {
    declarations: { type: [CopyrightItemSchema], default: [] },
    pillars: { type: [CopyrightItemSchema], default: [] },
    guidelines: { type: [CopyrightItemSchema], default: [] },
    contactNotice: { type: [CopyrightItemSchema], default: [] },
  },
  { timestamps: true },
);

const CopyrightContent =
  mongoose.models.CopyrightContent ||
  mongoose.model('CopyrightContent', CopyrightContentSchema);

const copyrightSeedData = {
  declarations: [
    {
      title: 'الملكية الحصرية للكتّاب والباحثين والمؤلفين',
      description:
        'تؤكد "بوابة أبين الثقافية" بشكل حاسم ومطلق أن جميع السير الذاتية، الدراسات التاريخية، المقالات، الأشعار، المخطوطات، والمواد الأدبية والفكرية المعروضة بالمنصة هي ملك أصلي وحصري لكُتّابها، مؤلفيها، وباحثيها، أو للورثة الشرعيين لحقوقهم الفكرية. المنصة لا تملك أي حقوق ملكية فكرية على هذه المواد.',
    },
    {
      title: 'صفة المنصة كمكتبة وأرشيف رقمي غير تجاري',
      description:
        'تُمارس البوابة دورها كصرح وثائقي وطني ومكتبة أرشيفية مفتوحة تهدف صون التراث وتيسير المعرفة للجمهور والباحثين بدون أي غايات تجارية أو ربحية.',
    },
  ],
  pillars: [
    {
      title: 'التنسيب والإسناد الصريح للمصادر',
      description:
        'التزام تام بذكر اسم الكاتب، الباحث، المؤرخ، أو الجمعية التراثية في صدر كل مادة وأرشيف مع حفظ الحق المعنوي كاملاً لمبتكره.',
    },
    {
      title: 'النفع العام والمحافظة على التراث',
      description:
        'إتاحة المحتوى الثقافي لأبناء المحافظة والمهتمين بالتعريف بالهوية الأبينية الأصيلة مع منع الاستغلال التجاري لأي مادة.',
    },
    {
      title: 'الأمانة العلمية والتدقيق التوثيقي',
      description:
        'الاعتماد على الروايات الشفاهية الأصيلة والمراجع التوثيقية المعتمدة مع توفير مسار لتصحيح أو استكمال البيانات.',
    },
  ],
  guidelines: [
    {
      title: 'ضوابط الاقتباس والنقل للباحثين والإعلام',
      description:
        'يُسمح للباحثين والمؤسسات الإعلامية والثقافية بنقل واقتباس المحتوى بشرط الإسناد الصريح لاسم الكاتب الأصلي ثم الإشارة إلى "بوابة أبين الثقافية" كمصدر أرشيفي.',
    },
    {
      title: 'حظر إعادة النشر التجاري بدون إذن',
      description:
        'يُمنع منعاً باتاً طباعة، بيع، أو إعادة نشر أجزاء كاملة من الكتب والأبحاث والسير لأغراض تجارية دون موافقة خطية صريحة من صاحب الحق الفكري أو ورثته الشرعيين.',
    },
  ],
  contactNotice: [
    {
      title: 'آلية طلبات التعديل أو التنسيب أو الحذف',
      description:
        'يحق لأي كاتب أو مؤلف أو وريث شرعي طلب تحديث بيانات نسب المادة الفكرية أو طلب إزالتها من الأرشيف الرقمي للمنصة عبر التواصل المباشر مع إدارة التوثيق والأرشيف.',
    },
  ],
};

async function seedCopyright() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear existing
    const deleteResult = await CopyrightContent.deleteMany({});
    console.log(
      `Cleared ${deleteResult.deletedCount} existing copyright documents.`,
    );

    // Insert new
    const newCopyright = new CopyrightContent(copyrightSeedData);
    await newCopyright.save();
    console.log(`Successfully seeded Copyright & IP content!`);
  } catch (error) {
    console.error('Error seeding copyright data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedCopyright();
