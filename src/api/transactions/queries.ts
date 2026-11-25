import { queryOptions, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { transactionsApi } from "./index";
import { queryClient } from "@/lib/queryClient";
import type {
  CreateTransactionInput,
  TransactionFilters,
  UpdateTransactionInput,
} from "@/types/transaction";

const all = ["transactions"] as const;

export const transactionQueries = {
  all,
  list: (filters?: TransactionFilters) =>
    queryOptions({
      queryKey: [...all, "list", filters ?? {}],
      queryFn: ({ signal }) => transactionsApi.list(filters, { signal }).then((res) => res.data),
    }),
};

export const useTransactions = (filters?: TransactionFilters) =>
  useQuery(transactionQueries.list(filters));

export const useTransactionsInfinite = (filters?: TransactionFilters) =>
  useInfiniteQuery({
    queryKey: [...all, "infinite", filters ?? {}],
    queryFn: ({ pageParam, signal }) => transactionsApi.listPage(filters, pageParam, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.has_more ? allPages.length + 1 : undefined),
  });

// A transaction feeds every number on the dashboard and the monthly report (today's
// revenue/expense/profit, each partner's share, transactions-by-type, customer
// balances), so creating/editing/deleting one must invalidate "reports" too — not just
// the transactions list — or those screens keep showing stale totals until a full
// page reload.
const invalidateTransactions = () => {
  queryClient.invalidateQueries({ queryKey: all });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
};

export const useCreateTransaction = () =>
  useMutation({
    mutationFn: ({
      data,
      idempotencyKey,
    }: {
      data: CreateTransactionInput;
      idempotencyKey: string;
    }) => transactionsApi.create(data, idempotencyKey),
    onSuccess: invalidateTransactions,
  });

export const useUpdateTransaction = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionInput }) =>
      transactionsApi.update(id, data),
    onSuccess: invalidateTransactions,
  });

export const useDeleteTransaction = () =>
  useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: invalidateTransactions,
  });
