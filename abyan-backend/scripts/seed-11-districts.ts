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

const allDistricts = [
  {
    name: "زنجبار",
    title: "عاصمة المحافظة وقلبها النابض",
    region: "coastal",
    regionLabel: "الدلتا والساحل",
    capital: "زنجبار",
    areaKm2: "198",
    areaPercentage: "1%",
    villages: ["زنجبار", "باجدار", "العمودية", "الطرية", "دهل أحمد", "الكود"],
    crops: ["القطن", "الموز", "المانجو"],
    landmarks: ["مبنى المحافظة", "كورنيش الشهيد سالم قطن"],
    description: "زنجبار هي عاصمة محافظة أبين، تتميز بموقعها الساحلي والزراعي الخصب، وتعتبر المركز الإداري والسياسي للمحافظة.",
    geography: "أراضٍ سهلية ساحلية زراعية متصلة بدلتا أبين الخصبة.",
    image: "",
    isActive: true,
    population: "30000"
  },
  {
    name: "خنفر",
    title: "أكبر مديريات أبين وسلتها الغذائية",
    region: "coastal",
    regionLabel: "الدلتا والساحل",
    capital: "جعار",
    areaKm2: "2199",
    areaPercentage: "10%",
    villages: ["جعار", "المخزن", "باتيس", "الدرجاج", "الحصن", "الرواء", "الرميلة", "شقرة"],
    crops: ["الموز", "السمسم", "القطن", "الذرة", "الباباي"],
    landmarks: ["سد باتيس", "جبل خنفر", "مصنع الأسمنت", "ساحل شقرة"],
    description: "خنفر هي أكبر مديريات أبين وأكثرها سكاناً ومساحة زراعية، وتحتضن دلتا أبين الشهيرة.",
    geography: "سهول زراعية واسعة تتخللها أودية مثل وادي بنا وحسان، وتمتد حتى الشريط الساحلي في شقرة.",
    image: "",
    isActive: true,
    population: "120000"
  },
  {
    name: "لودر",
    title: "عروس المنطقة الوسطى",
    region: "central",
    regionLabel: "المنطقة الوسطى",
    capital: "لودر",
    areaKm2: "1200",
    areaPercentage: "5%",
    villages: ["لودر", "زارة", "العين", "الحضن", "شوكان", "اماجل"],
    crops: ["البرتقال", "اليوسفي", "الخضروات", "الذرة"],
    landmarks: ["جبل ثرة", "سوق لودر القديم", "حصن زارة"],
    description: "لودر من أهم المدن التجارية والزراعية في المنطقة الوسطى وتتوسط الطريق بين أبين والبيضاء.",
    geography: "مناطق جبلية وسهول زراعية خصبة تعتمد على الأمطار والآبار.",
    image: "",
    isActive: true,
    population: "90000"
  },
  {
    name: "مودية",
    title: "أرض التاريخ والعلماء",
    region: "central",
    regionLabel: "المنطقة الوسطى",
    capital: "مودية",
    areaKm2: "1100",
    areaPercentage: "4%",
    villages: ["مودية", "جبلة", "القوز", "أورمة", "مركش", "الجيزة"],
    crops: ["القمح", "الذرة", "السمسم", "الخضروات"],
    landmarks: ["حصون مودية القديمة", "جبل عكد"],
    description: "مودية مديرية تاريخية عريقة أنجبت الكثير من قادة اليمن ووجهائها، تتميز بطابعها القبلي والزراعي.",
    geography: "أودية وجبال وسهول خصبة، وتتوسط محافظة أبين.",
    image: "",
    isActive: true,
    population: "50000"
  },
  {
    name: "المحفد",
    title: "بوابة أبين الشرقية",
    region: "eastern",
    regionLabel: "المنطقة الشرقية",
    capital: "المحفد",
    areaKm2: "2400",
    areaPercentage: "11%",
    villages: ["المحفد", "الخون", "الحاق", "باكازم", "سناج"],
    crops: ["البن", "الذرة", "السمسم"],
    landmarks: ["حصن طرج", "جبال المحفد"],
    description: "المحفد هي البوابة الشرقية لمحافظة أبين المحاذية لشبوة، وتتميز بطبيعتها الجبلية الشاهقة.",
    geography: "جبلية وعرة تتخللها بعض الأودية التي تعتمد على السيول.",
    image: "",
    isActive: true,
    population: "30000"
  },
  {
    name: "أحور",
    title: "مدينة السواحل والأودية",
    region: "coastal",
    regionLabel: "الدلتا والساحل",
    capital: "أحور",
    areaKm2: "4384",
    areaPercentage: "20%",
    villages: ["أحور", "حناذ", "المساني", "البندر"],
    crops: ["الحبحب (البطيخ)", "السمسم", "البصل", "المانجو"],
    landmarks: ["ساحل أحور", "حصن أحور", "وادي أحور"],
    description: "أحور من كبريات مديريات أبين مساحة، تتميز بتداخل الزراعة والنشاط البحري وتشتهر بإنتاج الحبحب والأسماك.",
    geography: "شريط ساحلي طويل على البحر العربي مع أودية زراعية ممتدة.",
    image: "",
    isActive: true,
    population: "40000"
  },
  {
    name: "جيشان",
    title: "الجوهرة المخفية بين الجبال",
    region: "central",
    regionLabel: "المنطقة الوسطى",
    capital: "جيشان",
    areaKm2: "800",
    areaPercentage: "4%",
    villages: ["جيشان", "العذيبة", "رحاب", "السهلة"],
    crops: ["البن", "العسل", "الذرة"],
    landmarks: ["وديان جيشان الطبيعية", "حصون جيشان"],
    description: "مديرية جبلية بامتياز، تشتهر بإنتاج أجود أنواع العسل والبن الأبيني وتتميز بطبيعة بكر خلابة.",
    geography: "جبلية قاسية ووعرة تتوسطها وديان خصبة صغيرة.",
    image: "",
    isActive: true,
    population: "20000"
  },
  {
    name: "الوضيع",
    title: "موطن الرؤساء والأبطال",
    region: "central",
    regionLabel: "المنطقة الوسطى",
    capital: "الوضيع",
    areaKm2: "900",
    areaPercentage: "4%",
    villages: ["الوضيع", "الردع", "جحين", "الخبر", "مارم"],
    crops: ["الذرة", "السمسم", "الخضروات"],
    landmarks: ["القرى التراثية", "وادي النخعين"],
    description: "مديرية الوضيع تقع في المنطقة الوسطى وتعرف بنشاطها الزراعي والرعوي، وهي مسقط رأس العديد من الشخصيات القيادية.",
    geography: "تتنوع بين السهول والأودية الممتدة والنجود المرتفعة.",
    image: "",
    isActive: true,
    population: "30000"
  },
  {
    name: "رصد",
    title: "قلب يافع النابض",
    region: "yafa",
    regionLabel: "يافع أبين",
    capital: "رصد",
    areaKm2: "600",
    areaPercentage: "3%",
    villages: ["رصد", "رخمة", "السعدي", "العمري", "شعب البارع"],
    crops: ["البن اليافعي", "الذرة", "الدخن"],
    landmarks: ["حصون يافع التاريخية", "جبل اليزيدي", "العمارة الحجرية"],
    description: "رصد هي عاصمة يافع التابعة لأبين، وتتميز بالعمارة الحجرية اليافعية الفريدة والمدرجات الزراعية.",
    geography: "جبلية شاهقة الارتفاع وباردة، تعتمد على زراعة المدرجات الجبلية.",
    image: "",
    isActive: true,
    population: "60000"
  },
  {
    name: "سرار",
    title: "أرض الجمال والطبيعة",
    region: "yafa",
    regionLabel: "يافع أبين",
    capital: "سرار",
    areaKm2: "500",
    areaPercentage: "2%",
    villages: ["سرار", "حطاط", "كلد", "الخشنا"],
    crops: ["البن", "الذرة", "الفواكه الجبلية"],
    landmarks: ["وادي حطاط الساحر", "شلالات سرار", "جبل موفجة"],
    description: "سرار إحدى مديريات يافع وتتميز بوادي حطاط الخلاب الذي يعتبر مزاراً سياحياً للمنطقة.",
    geography: "جبال شاهقة ووديان عميقة دائمة الجريان في بعض المواسم.",
    image: "",
    isActive: true,
    population: "35000"
  },
  {
    name: "سباح",
    title: "قمم تعانق السحاب",
    region: "yafa",
    regionLabel: "يافع أبين",
    capital: "سباح",
    areaKm2: "400",
    areaPercentage: "2%",
    villages: ["سباح", "طسة", "حدق", "العرقة"],
    crops: ["البن", "القمح", "الذرة"],
    landmarks: ["جبل سباح", "حصون سباح القديمة"],
    description: "مديرية سباح من أبرد مناطق أبين وتشتهر بقممها العالية وزراعة البن في المدرجات.",
    geography: "مرتفعات جبلية قاسية ومناخ بارد شتاءً ومعتدل صيفاً.",
    image: "",
    isActive: true,
    population: "25000"
  }
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('abyan_db');
    const collection = db.collection('districts');

    console.log("Seeding all 11 Abyan districts...");
    for (const district of allDistricts) {
      const result = await collection.updateOne(
        { name: district.name },
        { 
          $set: {
            ...district,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`Upserted district: ${district.name} - Villages: ${district.villages.length}`);
    }
    console.log("تم إضافة وتحديث جميع مديريات أبين الـ 11 بنجاح!");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await client.close();
  }
}

main();
