import api, { type RequestOptions } from "@/lib/axios";
import type {
  DailyReport,
  GenerateSettlementsResponse,
  MonthlyBalanceRow,
  MonthlyReport,
  TransactionsSummaryRow,
} from "@/types/report";
import type { CustomerOpenBalanceRow } from "@/types/customer";

const PREFIX = "/reports";

export const reportsApi = {
  monthly: (year: number, month: number, options?: RequestOptions) =>
    api.get<MonthlyReport>(`${PREFIX}/monthly`, { params: { year, month }, ...options }),
  settleMonthlyPartner: (partnerId: number, year: number, month: number) =>
    api.patch<MonthlyBalanceRow>(`${PREFIX}/monthly/${partnerId}/settle`, undefined, {
      params: { year, month },
    }),
  generateSettlements: (year: number, month: number) =>
    api.post<GenerateSettlementsResponse>(`${PREFIX}/monthly/${year}/${month}/settlements`),
  transactionsSummary: (
    params: { year: number; month: number } | { from?: string; to?: string },
    options?: RequestOptions,
  ) => api.get<TransactionsSummaryRow[]>(`${PREFIX}/transactions-summary`, { params, ...options }),
  customersOpenBalance: (options?: RequestOptions) =>
    api.get<CustomerOpenBalanceRow[]>(`${PREFIX}/customers-open-balance`, options),
  daily: (date: string, options?: RequestOptions) =>
    api.get<DailyReport>(`${PREFIX}/daily`, { params: { date }, ...options }),
};
