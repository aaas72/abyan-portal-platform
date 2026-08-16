/**
 * Utility functions for Arabic formatting, numbers, and formal dates
 */

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts Western digits (0-9) to Eastern Arabic digits (٠-٩)
 */
export function toArabicDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (w) => ARABIC_DIGITS[Number(w)]);
}

/**
 * Formats full dates (e.g. "1940-01-01" or "01-01-1940") into formal Arabic (e.g. "١ يناير ١٩٤٠م")
 * or simple years into formal Arabic years (e.g. "١٩٦٥م")
 */
export function formatFormalArabicDate(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.trim()) return '';
  const clean = dateStr.trim();

  // Check if it is a full date: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    const monthName = ARABIC_MONTHS[month - 1] || '';
    return `${toArabicDigits(day)} ${monthName} ${toArabicDigits(year)}م`;
  }

  // Check if it is a full date: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = dmyMatch[3];
    const monthName = ARABIC_MONTHS[month - 1] || '';
    return `${toArabicDigits(day)} ${monthName} ${toArabicDigits(year)}م`;
  }

  // Check if it is a 4-digit year (e.g. "1965")
  if (/^\d{4}$/.test(clean)) {
    return `${toArabicDigits(clean)}م`;
  }

  return toArabicDigits(clean);
}

/**
 * Formats a career period (e.g. startYear="1965", endYear="2017") into "١٩٦٥م - ٢٠١٧م"
 */
export function formatFormalArabicPeriod(startYear?: string | null, endYear?: string | null): string {
  if (!startYear && !endYear) return '';
  const start = formatFormalArabicDate(startYear);
  const end = formatFormalArabicDate(endYear);
  if (start && end) {
    return `${start} - ${end}`;
  }
  return start || end;
}
