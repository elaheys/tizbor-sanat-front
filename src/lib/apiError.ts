import { isAxiosError } from "axios";

// Backend error strings are plain English (e.g. "current password is incorrect"), meant for
// logs/API consumers, not for display in this Persian UI — translate the known ones here
// instead of showing them to the user as-is; anything unmapped falls back to a generic message
// rather than leaking raw English text.
const KNOWN_MESSAGES: Record<string, string> = {
  "invalid username or password": "نام کاربری یا رمز عبور اشتباه است",
  "current password is incorrect": "رمز عبور فعلی اشتباه است",
  "this username is already taken": "این نام کاربری قبلاً استفاده شده است",
  "this partner has transactions, ledger entries, or invoices on record and cannot be deleted — deactivate it instead":
    "این شریک تراکنش، مانده یا فاکتور ثبت‌شده دارد و نمی‌توان حذفش کرد — به‌جای حذف، غیرفعالش کنید",
  "you cannot delete your own account while logged in as it":
    "نمی‌توانید حساب خودتان را درحالی‌که با آن وارد شده‌اید حذف کنید",
};

const LOCKOUT_PATTERN =
  /^too many failed attempts for this account — try again in (\d+) minute\(s\)$/;

export function getApiErrorMessage(error: unknown, fallback = "خطایی رخ داد"): string {
  if (isAxiosError(error)) {
    const serverMessage = (error.response?.data as { error?: string } | undefined)?.error;
    if (serverMessage) {
      if (KNOWN_MESSAGES[serverMessage]) return KNOWN_MESSAGES[serverMessage];
      const lockoutMatch = serverMessage.match(LOCKOUT_PATTERN);
      if (lockoutMatch) {
        return `تعداد تلاش‌های ناموفق بیش از حد مجاز است — تا ${lockoutMatch[1]} دقیقهٔ دیگر دوباره تلاش کنید`;
      }
      return fallback;
    }
    if (error.code === "ERR_NETWORK") return "ارتباط با سرور برقرار نشد";
  }
  return fallback;
}
