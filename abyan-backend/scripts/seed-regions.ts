import 'dotenv/config';
import { MongoClient } from 'mongodb';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} مطلوب — عرّفه في ملف .env قبل تشغيل هذا السكربت`);
  }
  return value;
}

const uri = requireEnv('MONGODB_URI');

const regions = [
  {
    regionKey: 'coastal',
    regionLabel: 'العاصمة ودلتا أبين والساحل',
    description: 'وهي مناطق الثقل الإداري، الزراعي (الدلتا)، والشريط الساحلي:\n- زنجبار: العاصمة والمركز الإداري للمحافظة.\n- خنفر: قلب دلتا أبين وأكبر مديريات المحافظة مساحة وسكاناً (تضم مدينة جعار).\n- أحور: مديرية الشريط الساحلي (ورغم تصنيفها الساحلي، إلا أنها ترتبط قبلياً وتاريخياً بالمحفد كجزء من أراضي باكازم).',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    regionKey: 'central',
    regionLabel: 'المنطقة الوسطى',
    description: 'تمثل الثقل السياسي، العسكري، والزراعي الداخلي للمحافظة (وتضم مناطق دثينة والعواذل وغيرها):\n- لودر\n- مودية\n- الوضيع\n- جيشان',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    regionKey: 'eastern',
    regionLabel: 'البوابة الشرقية',
    description: 'المحفد: البوابة الشرقية الاستراتيجية لمحافظة أبين. تتحكم بالخط الدولي الرابط بين عدن وأبين وصولاً إلى شبوة وحضرموت، وتتميز بطبيعتها القبلية المتماسكة والجبلية الوعرة.',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    regionKey: 'yafa',
    regionLabel: 'مناطق يافع أبين (يافع بني قاصد)',
    description: 'تمثل الامتداد الجغرافي والقبلي ليافع الكبرى داخل حدود أبين الإدارية، وتتسم بطبيعتها الجبلية الشاهقة:\n- رصد\n- سرار\n- سباح',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('abyan_db');
    const collection = db.collection('districtregions');

    // Clear existing to avoid duplicates with old keys
    await collection.deleteMany({});
    console.log("Cleared old regions.");

    for (const region of regions) {
      const result = await collection.updateOne(
        { regionKey: region.regionKey },
        { $set: region },
        { upsert: true }
      );
      console.log(`Upserted region: ${region.regionLabel} with key ${region.regionKey}`);
    }
    console.log("تم إضافة التقسيمات العرفية بنجاح!");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await client.close();
  }
}

main();
