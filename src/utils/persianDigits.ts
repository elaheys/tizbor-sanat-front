const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Converts any Western digits found in a string/number to Persian digits. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Formats a number with thousands separators and Persian digits (e.g. amounts). */
export function formatToman(amount: string | number): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return toPersianDigits(amount);
  return toPersianDigits(num.toLocaleString("en-US"));
}
