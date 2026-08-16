import { MediaItem } from "@/types/schemas";

/**
 * Determines the contextual title for quotes/statements based on figure/item category
 */
export function getQuoteLabel(item: MediaItem): string {
  const cat = (item.categoryLabel || "").toLowerCase();
  const sub = (item.subtitle || "").toLowerCase();

  if (cat.includes("سياس") || cat.includes("دولة") || sub.includes("رئيس") || sub.includes("وزير") || sub.includes("سياس") || sub.includes("جمهورية")) {
    return "من كلمات وتصريحات الشخصية:";
  }
  if (cat.includes("شعر") || cat.includes("أدب") || sub.includes("شاعر") || sub.includes("أديب")) {
    return "شاهد شعري ومقتطف أدبي:";
  }
  if (cat.includes("فن") || cat.includes("موسيق") || cat.includes("تراث") || sub.includes("فنان") || sub.includes("ملحن") || sub.includes("مغن")) {
    return "شاهد غنائي وتراثي:";
  }
  if (cat.includes("علم") || cat.includes("فكر") || cat.includes("دين") || sub.includes("عالم") || sub.includes("مفكر") || sub.includes("شيخ") || sub.includes("قاض")) {
    return "من أقواله وحكمه المأثورة:";
  }
  if (cat.includes("عسكر") || cat.includes("قاد") || sub.includes("قائد") || sub.includes("لواء") || sub.includes("عميد") || sub.includes("جيش")) {
    return "من أقوال ووصايا القائد:";
  }
  if (cat.includes("معلم") || cat.includes("أثر") || cat.includes("تاريخ") || cat.includes("حصن")) {
    return "شاهد وتوثيق تاريخي:";
  }
  return "شاهد ومقولة مأثورة:";
}

/**
 * Determines the contextual title for career / term periods based on figure/item category
 */
export function getCareerPeriodLabel(item: MediaItem): string {
  const cat = (item.categoryLabel || "").toLowerCase();
  const sub = (item.subtitle || "").toLowerCase();

  if (sub.includes("رئيس") || sub.includes("رئاسة") || cat.includes("رئاس")) {
    return "فترة الرئاسة";
  }
  if (sub.includes("سلطان") || sub.includes("أمير") || sub.includes("حاكم") || cat.includes("سلطن") || cat.includes("إمار")) {
    return "فترة الحكم";
  }
  if (
    cat.includes("سياس") ||
    cat.includes("دولة") ||
    sub.includes("وزير") ||
    sub.includes("سفير") ||
    sub.includes("محافظ") ||
    sub.includes("برلمان") ||
    sub.includes("سياس") ||
    sub.includes("جمهورية")
  ) {
    return "فترة المنصب";
  }
  if (
    cat.includes("عسكر") ||
    cat.includes("جيش") ||
    cat.includes("ثور") ||
    sub.includes("قائد") ||
    sub.includes("لواء") ||
    sub.includes("عميد") ||
    sub.includes("عقيد") ||
    sub.includes("مناضل")
  ) {
    return "الخدمة العسكرية";
  }
  if (
    cat.includes("فن") ||
    cat.includes("موسيق") ||
    cat.includes("غناء") ||
    cat.includes("طرب") ||
    sub.includes("فنان") ||
    sub.includes("ملحن") ||
    sub.includes("مغن") ||
    sub.includes("عازف")
  ) {
    return "المسار الفني";
  }
  if (
    cat.includes("شعر") ||
    cat.includes("أدب") ||
    cat.includes("قصيد") ||
    sub.includes("شاعر") ||
    sub.includes("أديب") ||
    sub.includes("كاتب") ||
    sub.includes("روائي") ||
    sub.includes("مؤرخ")
  ) {
    return "المسار الأدبي";
  }
  if (
    cat.includes("علم") ||
    cat.includes("فكر") ||
    cat.includes("دين") ||
    cat.includes("قضاء") ||
    sub.includes("عالم") ||
    sub.includes("مفكر") ||
    sub.includes("شيخ") ||
    sub.includes("قاض") ||
    sub.includes("فقيه")
  ) {
    return "المسار العلمي";
  }
  return "فترة النشاط";
}
