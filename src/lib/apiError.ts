import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback = "خطایی رخ داد"): string {
  if (isAxiosError(error)) {
    const serverMessage = (error.response?.data as { error?: string } | undefined)?.error;
    if (serverMessage) return serverMessage;
    if (error.code === "ERR_NETWORK") return "ارتباط با سرور برقرار نشد";
  }
  return fallback;
}
