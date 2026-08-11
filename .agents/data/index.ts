/**
 * Central Data Barrel Export - بوابة أبين الثقافية
 * ينظم ويعيد تصدير كافة ملفات البيانات المقسمة منطقياً ومنهجياً إلى 3 قطاعات رئيسية:
 * 1. الموسوعة التاريخية والجغرافية (Encyclopedia)
 * 2. الموروث الثقافي والاقتصادي والأرشيف (Heritage)
 * 3. بيانات تعريف المنصة (Portal)
 */

// 1. الموسوعة التاريخية والجغرافية (Encyclopedia Domain)
export * from "./encyclopedia/districtsData";
export * from "./encyclopedia/landmarksData";
export * from "./encyclopedia/historyData";
export * from "./encyclopedia/pioneersData";

// 2. الموروث الثقافي والاقتصادي والأرشيف الرقمي (Heritage & Economy Domain)
export * from "./heritage/cultureData";
export * from "./heritage/economyData";
export * from "./heritage/galleryData";

// 3. بيانات تعريف البوابة والرئيسية (Portal Meta Domain)
export * from "./portal/highlightsData";
export * from "./portal/aboutData";
