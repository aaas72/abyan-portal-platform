import { z } from "zod";

/**
 * 0. Content Source / Reference Item Schema
 */
export const ContentSourceSchema = z.object({
  name: z.string().trim().min(1, "اسم المصدر مطلوب"),
  url: z.string().trim().optional(),
});
export type ContentSource = z.infer<typeof ContentSourceSchema>;

/**
 * 1. Photo & Visual Card Schema
 */
export const PhotoCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tag: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  bgGradient: z.string().optional(),
  images: z.array(z.string()).optional(),
});
export type PhotoCard = z.infer<typeof PhotoCardSchema>;

/**
 * 2. Landmark Category Schema
 */
export const LandmarkCategorySchema = z.object({
  id: z.string().min(1),
  categoryName: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  keyLandmarks: z.array(z.string()),
  details: z.array(z.string()),
  photoCards: z.array(PhotoCardSchema).optional(),
});
export type LandmarkCategory = z.infer<typeof LandmarkCategorySchema>;

/**
 * 3. Pioneer Figure & Category Schema
 */
export const PioneerFigureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  location: z.string().min(1),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  biography: z.string().min(1),
  quote: z.string().optional(),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  bgGradient: z.string().min(1),
  images: z.array(z.string()).optional(),
});
export type PioneerFigure = z.infer<typeof PioneerFigureSchema>;

export const PioneerCategorySchema = z.object({
  id: z.string().min(1),
  categoryName: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  figures: z.array(PioneerFigureSchema),
});
export type PioneerCategory = z.infer<typeof PioneerCategorySchema>;

export const PioneerFormDataSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب"),
  title: z.string().trim().min(1, "اللقب / الصفة مطلوبة"),
  category: z.string().trim().min(1, "يرجى اختيار الفئة أو التصنيف"),
  origin: z.string().trim().min(1, "المنشأ / المديرية مطلوبة"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  startYear: z.string().trim().min(1, "سنة بداية الحقبة مطلوبة"),
  endYear: z.string().trim().min(1, "سنة نهاية الحقبة مطلوبة"),
  biography: z.string().trim().min(1, "السيرة الذاتية أو التفاصيل مطلوبة"),
  quote: z.string().optional(),
  birthDate: z.string().trim().min(1, "تاريخ الميلاد مطلوب"),
  deathDate: z.string().trim().optional(),
  isPublished: z.boolean(),
  achievements: z.array(z.string()).min(1, "إضافة إنجاز واحد على الأقل مطلوب"),
  images: z.array(z.string()).optional(),
});
export type PioneerFormData = z.infer<typeof PioneerFormDataSchema>;

/**
 * 4. Folk Heritage & Audio/Cuisine Schema
 */
export const AudioTrackSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  artist: z.string().min(1),
  category: z.string().min(1),
  duration: z.string().min(1),
  lyricsExcerpt: z.string().min(1),
  audioUrl: z.string().optional(),
});
export type AudioTrack = z.infer<typeof AudioTrackSchema>;

export const VisualShowcaseSchema = z.object({
  title: z.string().min(1),
  tag: z.string().min(1),
  description: z.string().min(1),
  bgGradient: z.string().min(1),
  images: z.array(z.string()).optional(),
});
export type VisualShowcase = z.infer<typeof VisualShowcaseSchema>;

export const CultureCategorySchema = z.object({
  id: z.string().min(1),
  categoryName: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  primaryTags: z.array(z.string()).optional(),
  details: z.array(z.string()).optional(),
  audioTrack: AudioTrackSchema.optional(),
  visualShowcase: VisualShowcaseSchema.optional(),
  items: z.array(PhotoCardSchema).optional(),
});
export type CultureCategory = z.infer<typeof CultureCategorySchema>;

/**
 * 5. Economy Pillar Schema
 */
export const EconomyPillarSchema = z.object({
  id: z.string().min(1),
  pillarName: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  keyProducts: z.array(z.string()),
  details: z.array(z.string()),
  photoCards: z.array(PhotoCardSchema).optional(),
  images: z.array(z.string()).optional(),
});
export type EconomyPillar = z.infer<typeof EconomyPillarSchema>;

export const LandmarkDetailSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  description: z.string().min(1),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  bgGradient: z.string().optional(),
  images: z.array(z.string()).optional(),
});
export type LandmarkDetail = z.infer<typeof LandmarkDetailSchema>;

export const PioneerDetailSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  description: z.string().min(1),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  bgGradient: z.string().optional(),
  images: z.array(z.string()).optional(),
});
export type PioneerDetail = z.infer<typeof PioneerDetailSchema>;

export const DistrictCardItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  role: z.string().optional(),
  tag: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  fullBiography: z.string().optional(),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  bgGradient: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});
export type DistrictCardItem = z.infer<typeof DistrictCardItemSchema>;

/**
 * 6. District Item Schema
 */
export const DistrictItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  region: z.string().min(1),
  regionLabel: z.string().min(1),
  capital: z.string().min(1),
  areaKm2: z.string().min(1),
  areaPercentage: z.string().min(1),
  crops: z.array(z.string()),
  landmarks: z.array(z.string()),
  villages: z.array(z.string()),
  description: z.string().min(1),
  geography: z.string().min(1),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  oldName: z.string().optional(),
  historyOverview: z.string().optional(),
  historyMilestones: z.array(z.string()).optional(),
  climateAndNature: z.string().optional(),
  famousPioneers: z.array(z.string()).optional(),
  pioneersDetails: z.array(z.string()).optional(),
  historicalSites: z.array(z.string()).optional(),
  economyDetails: z.string().optional(),
  naturalResources: z.array(z.string()).optional(),
  traditionsAndCulture: z.string().optional(),
  folkHeritage: z.array(z.string()).optional(),
  landmarksList: z.array(LandmarkDetailSchema).optional(),
  pioneersList: z.array(PioneerDetailSchema).optional(),
  pioneersCardList: z.array(DistrictCardItemSchema).optional(),
  sitesCardList: z.array(DistrictCardItemSchema).optional(),
  cropsCardList: z.array(DistrictCardItemSchema).optional(),
  heritageCardList: z.array(DistrictCardItemSchema).optional(),
  images: z.array(z.string()).optional(),
});
export type DistrictItem = z.infer<typeof DistrictItemSchema>;

/**
 * 7. History Era Schema
 */
export const HistoryEraSchema = z.object({
  id: z.string().min(1),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  eraTitle: z.string().min(1),
  historicalCapital: z.string().min(1),
  shortSummary: z.string().min(1),
  fullDescription: z.string().min(1),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  keyEvents: z.array(z.string()),
  notableLandmarks: z.array(z.string()),
});
export type HistoryEra = z.infer<typeof HistoryEraSchema>;

/**
 * 8. Archive Item Schema
 */
export const ArchiveItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  title: z.string().min(1),
  year: z.string().min(1),
  location: z.string().min(1),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  aspectRatio: z.string().min(1),
  bgGradient: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).max(5, "يُسمح بـ 5 صور كحد أقصى").optional(),
});
export type ArchiveItem = z.infer<typeof ArchiveItemSchema>;

/**
 * 9. Home Highlight Item Schema
 */
export const HighlightItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  linkText: z.string().min(1),
  href: z.string().min(1),
});
export type HighlightItem = z.infer<typeof HighlightItemSchema>;

/**
 * 10. Unified Media Viewer Item Schema
 */
export const MediaItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  categoryLabel: z.string().optional(),
  year: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  location: z.string().optional(),
  authorName: z.string().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  fullBiography: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  quote: z.string().optional(),
  bgGradient: z.string().optional(),
  images: z.array(z.string()).optional(),
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

/**
 * 11. About Pillar Item Schema
 */
export const AboutPillarItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});
export type AboutPillarItem = z.infer<typeof AboutPillarItemSchema>;

export const AboutValueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});
export type AboutValue = z.infer<typeof AboutValueSchema>;

export const AboutScopeSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  items: z.array(z.string()),
});
export type AboutScope = z.infer<typeof AboutScopeSchema>;

export const AboutStatSchema = z.object({
  number: z.string().min(1),
  label: z.string().min(1),
});
export type AboutStat = z.infer<typeof AboutStatSchema>;

export const AboutContentSchema = z.object({
  pillars: z.array(AboutPillarItemSchema),
  values: z.array(AboutValueSchema),
  scopes: z.array(AboutScopeSchema),
  stats: z.array(AboutStatSchema),
});
export type AboutContent = z.infer<typeof AboutContentSchema>;

/**
 * 12. Copyright Content Schemas
 */
export const CopyrightItemSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().optional(),
  items: z.array(z.string()).optional(),
});
export type CopyrightItem = z.infer<typeof CopyrightItemSchema>;

export const CopyrightContentSchema = z.object({
  declarations: z.array(CopyrightItemSchema),
  pillars: z.array(CopyrightItemSchema),
  guidelines: z.array(CopyrightItemSchema),
  contactNotice: z.array(CopyrightItemSchema),
});
export type CopyrightContent = z.infer<typeof CopyrightContentSchema>;

export const CopyrightSectionFormDataSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  description: z.string().trim().min(1, "الوصف تفصيلي مطلوب"),
  summary: z.string().trim().optional(),
  items: z.array(z.string()).optional(),
});
export type CopyrightSectionFormData = z.infer<typeof CopyrightSectionFormDataSchema>;

/**
 * Admin Forms Zod Schemas
 */
export const AboutPillarFormDataSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
});
export type AboutPillarFormData = z.infer<typeof AboutPillarFormDataSchema>;

export const AboutValueFormDataSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
});
export type AboutValueFormData = z.infer<typeof AboutValueFormDataSchema>;

export const AboutScopeFormDataSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  summary: z.string().trim().min(1, "الملخص مطلوب"),
  items: z.array(z.string()).min(1, "أضف عنصراً واحداً على الأقل"),
});
export type AboutScopeFormData = z.infer<typeof AboutScopeFormDataSchema>;

export const AboutStatFormDataSchema = z.object({
  number: z.string().trim().min(1, "الرقم مطلوب"),
  label: z.string().trim().min(1, "التسمية مطلوبة"),
});
export type AboutStatFormData = z.infer<typeof AboutStatFormDataSchema>;

export const LandmarkCategoryFormDataSchema = z.object({
  categoryName: z.string().trim().min(1, "اسم الفئة مطلوب"),
  title: z.string().trim().min(1, "عنوان الفئة مطلوب"),
  subtitle: z.string().trim().min(1, "العنوان الفرعي مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  keyLandmarks: z.array(z.string()).min(1, "إضافة معلم فرعي واحد على الأقل"),
  details: z.array(z.string()).min(1, "إضافة تفصيل واحد على الأقل"),
  isActive: z.boolean(),
  images: z.array(z.string()).optional(),
});
export type LandmarkCategoryFormData = z.infer<typeof LandmarkCategoryFormDataSchema>;

export const PioneerCategoryFormDataSchema = z.object({
  categoryName: z.string().trim().min(1, "اسم التصنيف مطلوب"),
  title: z.string().trim().min(1, "العنوان مطلوب"),
  subtitle: z.string().trim().min(1, "العنوان الفرعي مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  keyFigures: z.array(z.string()).default([]),
  details: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});
export type PioneerCategoryFormData = z.infer<typeof PioneerCategoryFormDataSchema>;

export const LandmarkPhotoCardFormDataSchema = z.object({
  category: z.string().trim().min(1, "يرجى اختيار الفئة"),
  title: z.string().trim().min(1, "اسم المعلم مطلوب"),
  tag: z.string().trim().min(1, "النوع مطلوب"),
  location: z.string().trim().min(1, "الموقع مطلوب"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  bgGradient: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});
export type LandmarkPhotoCardFormData = z.infer<typeof LandmarkPhotoCardFormDataSchema>;

export const DistrictRegionFormDataSchema = z.object({
  regionKey: z.string().trim().min(1, "المعرف مطلوب"),
  regionLabel: z.string().trim().min(1, "الاسم المعروض مطلوب"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
export type DistrictRegionFormData = z.infer<typeof DistrictRegionFormDataSchema>;

export const DistrictFormDataSchema = z.object({
  name: z.string().trim().min(1, "اسم المديرية مطلوب"),
  title: z.string().trim().min(1, "العنوان الشارح مطلوب"),
  region: z.string().trim().min(1, "التقسيم العرفي مطلوب"),
  regionLabel: z.string().trim().min(1, "اسم التقسيم العرفي الشارح مطلوب"),
  capital: z.string().trim().min(1, "عاصمة المديرية مطلوبة"),
  areaKm2: z.string().trim().min(1, "المساحة مطلوبة"),
  areaPercentage: z.string().trim().min(1, "النسبة المئوية للمساحة مطلوبة"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  crops: z.array(z.string()).min(1, "إضافة محصول واحد على الأقل مطلوب"),
  landmarks: z.array(z.string()).min(1, "إضافة معلم واحد على الأقل مطلوب"),
  villages: z.array(z.string()).min(1, "إضافة قرية واحدة على الأقل مطلوب"),
  description: z.string().trim().min(1, "الوصف والشرح التوثيقي مطلوب"),
  geography: z.string().trim().min(1, "معلومات التضاريس والموقع مطلوبة"),
  isPublished: z.boolean(),
  images: z.array(z.string()).optional(),
});
export type DistrictFormData = z.infer<typeof DistrictFormDataSchema>;

export const CultureCategoryFormDataSchema = z.object({
  categoryName: z.string().trim().min(1, "اسم التراث / الفن مطلوب"),
  title: z.string().trim().min(1, "العنوان الرئيسي مطلوب"),
  subtitle: z.string().trim().min(1, "الموجز الشارح مطلوب"),
  description: z.string().trim().min(1, "الشرح التوثيقي والتراثي مطلوب"),
  primaryTags: z.array(z.string()).default([]),
  details: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});
export type CultureCategoryFormData = z.infer<typeof CultureCategoryFormDataSchema>;

export const CultureItemFormDataSchema = z.object({
  category: z.string().trim().min(1, "الفئة المرتبطة مطلوبة"),
  title: z.string().trim().min(1, "العنوان مطلوب"),
  tag: z.string().trim().min(1, "التصنيف / النوع مطلوب"),
  location: z.string().trim().min(1, "الموقع أو المنشأ مطلوب"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  bgGradient: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});
export type CultureItemFormData = z.infer<typeof CultureItemFormDataSchema>;

export const EconomyPillarFormDataSchema = z.object({
  pillarName: z.string().trim().min(1, "اسم القطاع مطلوب"),
  title: z.string().trim().min(1, "العنوان الرئيسي مطلوب"),
  subtitle: z.string().trim().min(1, "الموجز الاقتصادي مطلوب"),
  description: z.string().trim().min(1, "الشرح التوثيقي للقطاع مطلوب"),
  keyProducts: z.array(z.string()),
  details: z.array(z.string()),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});
export type EconomyPillarFormData = z.infer<typeof EconomyPillarFormDataSchema>;

export const EconomyPhotoCardFormDataSchema = z.object({
  pillar: z.string().trim().min(1, "القطاع المرتبط مطلوب"),
  title: z.string().trim().min(1, "العنوان مطلوب"),
  tag: z.string().trim().min(1, "التصنيف / النوع مطلوب"),
  location: z.string().trim().min(1, "الموقع أو الانتشار مطلوب"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  bgGradient: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});
export type EconomyPhotoCardFormData = z.infer<typeof EconomyPhotoCardFormDataSchema>;

export const HistoryEraFormDataSchema = z.object({
  startYear: z.string().trim().min(1, "سنة بداية الحقبة مطلوبة"),
  endYear: z.string().trim().min(1, "سنة نهاية الحقبة مطلوبة"),
  eraTitle: z.string().trim().min(1, "اسم الحقبة مطلوب"),
  historicalCapital: z.string().trim().min(1, "العاصمة التاريخية مطلوبة"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  shortSummary: z.string().trim().min(1, "الموجز التاريخي مطلوب"),
  fullDescription: z.string().trim().min(1, "السرد التاريخي مطلوب"),
  keyEvents: z.array(z.string().trim()).min(1, "يجب إضافة حدث واحد على الأقل"),
  notableLandmarks: z.array(z.string().trim()).default([]),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});
export type HistoryEraFormData = z.infer<typeof HistoryEraFormDataSchema>;

export const ArchiveCategoryFormDataSchema = z.object({
  categoryName: z.string().trim().min(1, "المعرف البرمجي للتصنيف مطلوب"),
  title: z.string().trim().min(1, "العنوان الشارح للتصنيف مطلوب"),
  subtitle: z.string().trim().min(1, "العنوان الفرعي مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  keyTags: z.array(z.string()).min(1, "إضافة تصنيف فرعي واحد على الأقل"),
  details: z.array(z.string()).min(1, "إضافة تفصيل واحد على الأقل"),
  isActive: z.boolean().default(true),
});
export type ArchiveCategoryFormData = z.infer<typeof ArchiveCategoryFormDataSchema>;

export const ArchiveItemFormDataSchema = z.object({
  title: z.string().trim().min(1, "عنوان الوثيقة مطلوب"),
  categoryLabel: z.string().trim().min(1, "تصنيف الوثيقة مطلوب"),
  year: z.string().trim().min(1, "سنة التوثيق مطلوبة"),
  location: z.string().trim().min(1, "موقع الوثيقة مطلوب"),
  authorName: z.string().trim().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  sources: z.array(ContentSourceSchema).optional(),
  description: z.string().trim().min(1, "الشرح والتفاصيل الأرشيفية مطلوبة"),
  isPublished: z.boolean(),
  images: z.array(z.string()).max(5, "يُسمح بـ 5 صور كحد أقصى").optional(),
});
export type ArchiveItemFormData = z.infer<typeof ArchiveItemFormDataSchema>;

export const HighlightItemFormDataSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  category: z.string().trim().min(1, "التصنيف مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  linkText: z.string().trim().min(1, "نص الرابط مطلوب"),
  href: z.string().trim().min(1, "الرابط مطلوب"),
  isActive: z.boolean().default(true),
});
export type HighlightItemFormData = z.infer<typeof HighlightItemFormDataSchema>;

export const LandingSectionFormDataSchema = z.object({
  sectionId: z.string().trim().min(1, "المعرف البرمجي مطلوب"),
  name: z.string().trim().min(1, "اسم القسم الرئيسي مطلوب"),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  images: z.array(z.string().url("يجب إدخال رابط صحيح")).optional(),
  isActive: z.boolean().default(true),
});
export type LandingSectionFormData = z.infer<typeof LandingSectionFormDataSchema>;

export interface AboutValueItem {
  title: string;
  description: string;
}

export interface AboutScopeItem {
  title: string;
  summary: string;
  items: string[];
}

export interface AboutStatItem {
  number: string;
  label: string;
}

// Users & Writers Schemas
export const UserFormDataSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يتكون من حرفين على الأقل'),
  username: z.string().min(3, 'اسم المستخدم مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل').optional(),
  role: z.enum(['admin', 'writer']),
  isActive: z.boolean().default(true)
});
export type UserFormData = z.infer<typeof UserFormDataSchema>;

// Contact Info Schema
export const ContactInfoSchema = z.object({
  emails: z.array(z.string().email("يجب إدخال بريد إلكتروني صحيح")).max(5, "لا يمكن إضافة أكثر من 5 إيميلات").default([]),
  phones: z.array(z.string().min(6, "رقم الهاتف قصير جداً")).max(5, "لا يمكن إضافة أكثر من 5 أرقام").default([]),
});
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
