import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
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

const invalidateLedger = () => queryClient.invalidateQueries({ queryKey: all });

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
