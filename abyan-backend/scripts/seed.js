require('dotenv').config();
const mongoose = require('mongoose');

const categories = [
  {
    categoryName: "writers",
    title: "الشعراء وأعلام الأدب",
    subtitle: "رواد الكلمة والشعر والأدب في أبين",
    isActive: true,
    isPublished: true
  },
  {
    categoryName: "politicians",
    title: "السياسيون وقادة الدولة",
    subtitle: "صناع القرار والشخصيات السياسية البارزة",
    isActive: true,
    isPublished: true
  },
  {
    categoryName: "scholars",
    title: "العلماء والمفكرون",
    subtitle: "أعلام العلم والفكر والدين",
    isActive: true,
    isPublished: true
  },
  {
    categoryName: "military",
    title: "القادة العسكريون والرموز القومية",
    subtitle: "قادة الكفاح المسلح والرموز الوطنية",
    isActive: true,
    isPublished: true
  },
  {
    categoryName: "artists",
    title: "رواد الثقافة والفنون",
    subtitle: "مبدعو الفن والمسرح والتراث",
    isActive: true,
    isPublished: true
  },
  {
    categoryName: "historical",
    title: "الشخصيات التاريخية والاجتماعية",
    subtitle: "أعلام التاريخ والمجتمع والأعيان",
    isActive: true,
    isPublished: true
  }
];

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI مطلوب — عرّفه في ملف .env قبل تشغيل هذا السكربت');
}

async function seedCategories() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const PioneerCategorySchema = new mongoose.Schema({}, { strict: false, collection: 'pioneercategories' });
    const PioneerCategory = mongoose.models.PioneerCategory || mongoose.model('PioneerCategory', PioneerCategorySchema);
    
    // Clear existing
    await PioneerCategory.deleteMany({});
    console.log("Cleared existing categories");

    await PioneerCategory.insertMany(categories);
    console.log("Seeded Pioneer Categories successfully");
    
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedCategories();
