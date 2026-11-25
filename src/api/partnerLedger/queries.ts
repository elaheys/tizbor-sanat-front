import { queryOptions, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { loansApi, partnerLedgerApi } from "./index";
import { queryClient } from "@/lib/queryClient";
import type { CreateLoanInput, LedgerFilters, UpdateLedgerEntryInput } from "@/types/ledger";

const all = ["partner-ledger"] as const;

export const partnerLedgerQueries = {
  all,
  list: (filters?: LedgerFilters) =>
    queryOptions({
      queryKey: [...all, "list", filters ?? {}],
      queryFn: ({ signal }) => partnerLedgerApi.list(filters, { signal }).then((res) => res.data),
    }),
  history: (from?: string, to?: string) =>
    queryOptions({
      queryKey: [...all, "history", from ?? "", to ?? ""],
      queryFn: ({ signal }) =>
        partnerLedgerApi.history(from, to, { signal }).then((res) => res.data),
    }),
};

export const usePartnerLedger = (filters?: LedgerFilters) =>
  useQuery(partnerLedgerQueries.list(filters));
export const usePartnerLedgerHistory = (from?: string, to?: string) =>
  useQuery(partnerLedgerQueries.history(from, to));

export const usePartnerLedgerHistoryInfinite = () =>
  useInfiniteQuery({
    queryKey: [...all, "history", "infinite"],
    queryFn: ({ pageParam, signal }) => partnerLedgerApi.historyPage(pageParam, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.has_more ? allPages.length + 1 : undefined),
  });

// A loan's open/settled state feeds each partner's net_loan_balance and closing_balance
// in the monthly report, so ledger mutations have to invalidate "reports" too, the same
// way useGenerateSettlements already does in the other direction.
const invalidateLedger = () => {
  queryClient.invalidateQueries({ queryKey: all });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
};

export const useCreateLoan = () =>
  useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateLoanInput; idempotencyKey: string }) =>
      loansApi.create(data, idempotencyKey),
    onSuccess: invalidateLedger,
  });

export const useUpdateLedgerEntry = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLedgerEntryInput }) =>
      partnerLedgerApi.update(id, data),
    onSuccess: invalidateLedger,
  });

export const useDeleteLedgerEntry = () =>
  useMutation({
    mutationFn: (id: number) => partnerLedgerApi.delete(id),
    onSuccess: invalidateLedger,
  });

export const useSettleLedgerEntry = () =>
  useMutation({
    mutationFn: (id: number) => partnerLedgerApi.settle(id),
    onSuccess: invalidateLedger,
  });
