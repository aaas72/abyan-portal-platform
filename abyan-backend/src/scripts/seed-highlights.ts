import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abyan_db';

const HighlightItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    linkText: { type: String, required: true },
    href: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const HighlightItem =
  mongoose.models.HighlightItem ||
  mongoose.model('HighlightItem', HighlightItemSchema);

const seedData = [
  {
    title: 'تاريخ عريق يمتد لآلاف السنين',
    category: 'التاريخ والحضارة',
    description:
      'تحتضن أبين شواهد حية على حضارات متعاقبة، من الممالك القديمة وحصون يافع ومسجد جعار إلى دورها المحوري في التاريخ الحديث وتأسيس الدولة.',
    linkText: 'استكشف التاريخ',
    href: '/history',
    isActive: true,
  },
  {
    title: 'تنوع جغرافي وبيئي فريد',
    category: 'الجغرافيا والبيئة',
    description:
      'من شواطئ شقرة وأحور الساحرة المطلة على بحر العرب، إلى السهول الخصبة في دلتا أبين، وصولاً إلى المرتفعات الجبلية الشاهقة في يافع ولودر.',
    linkText: 'اكتشف الجغرافيا',
    href: '/districts',
    isActive: true,
  },
  {
    title: 'سلة الغذاء والزراعة',
    category: 'الاقتصاد والزراعة',
    description:
      'تُعد دلتا أبين (بنا وحسان) من أخصب الأراضي الزراعية في الجزيرة العربية، حيث تشتهر بزراعة القطن طويل التيلة، والسمسم، وأجود أنواع الفواكه والخضروات.',
    linkText: 'تعرف على الاقتصاد',
    href: '/economy',
    isActive: true,
  },
  {
    title: 'أصالة التراث والموروث الشعبي',
    category: 'الثقافة والفنون',
    description:
      'تتميز أبين بموروث ثقافي غني يتجلى في الشعر الشعبي (الدان)، والأهازيج الزراعية، والرقصات الفلكلورية، بالإضافة إلى الصناعات الحرفية التقليدية المتوارثة.',
    linkText: 'استعرض الثقافة',
    href: '/culture',
    isActive: true,
  },
];

async function seedHighlights() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear existing
    const deleteResult = await HighlightItem.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing highlights.`);

    // Insert new
    const insertResult = await HighlightItem.insertMany(seedData);
    console.log(
      `Successfully inserted ${insertResult.length} highlight items!`,
    );
  } catch (error) {
    console.error('Error seeding highlights:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedHighlights();
