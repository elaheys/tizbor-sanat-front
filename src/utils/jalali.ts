import dayjs from "@/lib/dayjs";
import { toPersianDigits } from "./persianDigits";

/** Formats an ISO date/timestamp string as a Persian-digit Jalali date (e.g. ۱۴۰۴/۰۸/۲۷). */
export function toJalaliDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const formatted = dayjs(isoDate).calendar("jalali").format("YYYY/MM/DD");
  return toPersianDigits(formatted);
}

/** Formats an ISO timestamp as Jalali date + time (e.g. ۱۴۰۴/۰۸/۲۷ - ۱۴:۳۰). */
export function toJalaliDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const formatted = dayjs(isoDate).calendar("jalali").format("YYYY/MM/DD - HH:mm");
  return toPersianDigits(formatted);
}

/** Current Jalali year/month, used as default filters for monthly reports. */
export function currentJalaliYearMonth(): { year: number; month: number } {
  const jalali = dayjs().calendar("jalali");
  return { year: jalali.year(), month: jalali.month() + 1 };
}

/** Name of a Jalali month (1-12), in Persian. */
const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function jalaliMonthName(month: number): string {
  return JALALI_MONTH_NAMES[month - 1] ?? "";
}

const WEEKDAY_NAMES = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

/** "۱۱:۲۰" for today, "دیروز" for yesterday, otherwise a short Jalali date. */
export function toRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const d = dayjs(isoDate);
  const now = dayjs();
  if (d.isSame(now, "day")) return toPersianDigits(d.format("HH:mm"));
  if (d.isSame(now.subtract(1, "day"), "day")) return "دیروز";
  return toJalaliDate(isoDate);
}

/** "سه‌شنبه، ۲۵ آبان ۱۴۰۵" */
export function toJalaliLongDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const d = dayjs(isoDate);
  const jalali = d.calendar("jalali");
  const weekday = WEEKDAY_NAMES[d.day()];
  return `${weekday}، ${toPersianDigits(jalali.date())} ${jalaliMonthName(jalali.month() + 1)} ${toPersianDigits(jalali.year())}`;
}
