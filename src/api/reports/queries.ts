import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { reportsApi } from "./index";
import { queryClient } from "@/lib/queryClient";

const all = ["reports"] as const;

export const reportQueries = {
  all,
  monthly: (year: number, month: number) =>
    queryOptions({
      queryKey: [...all, "monthly", year, month],
      queryFn: ({ signal }) => reportsApi.monthly(year, month, { signal }).then((res) => res.data),
      enabled: Boolean(year && month),
    }),
  transactionsSummary: (year: number, month: number) =>
    queryOptions({
      queryKey: [...all, "transactions-summary", year, month],
      queryFn: ({ signal }) =>
        reportsApi.transactionsSummary({ year, month }, { signal }).then((res) => res.data),
      enabled: Boolean(year && month),
    }),
  customersOpenBalance: () =>
    queryOptions({
      queryKey: [...all, "customers-open-balance"],
      queryFn: ({ signal }) => reportsApi.customersOpenBalance({ signal }).then((res) => res.data),
    }),
  daily: (date: string) =>
    queryOptions({
      queryKey: [...all, "daily", date],
      queryFn: ({ signal }) => reportsApi.daily(date, { signal }).then((res) => res.data),
      enabled: Boolean(date),
    }),
};

export const useMonthlyReport = (year: number, month: number) =>
  useQuery(reportQueries.monthly(year, month));
export const useTransactionsSummary = (year: number, month: number) =>
  useQuery(reportQueries.transactionsSummary(year, month));
export const useCustomersOpenBalance = () => useQuery(reportQueries.customersOpenBalance());
export const useDailyReport = (date: string) => useQuery(reportQueries.daily(date));

export const useSettleMonthlyPartner = () =>
  useMutation({
    mutationFn: ({ partnerId, year, month }: { partnerId: number; year: number; month: number }) =>
      reportsApi.settleMonthlyPartner(partnerId, year, month),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: all }),
  });

export const useGenerateSettlements = () =>
  useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      reportsApi.generateSettlements(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: all });
      queryClient.invalidateQueries({ queryKey: ["partner-ledger"] });
    },
  });
