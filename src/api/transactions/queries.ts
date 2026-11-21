import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { transactionsApi } from './index'
import { queryClient } from '@/lib/queryClient'
import type { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from '@/types/transaction'

const all = ['transactions'] as const

export const transactionQueries = {
  all,
  list: (filters?: TransactionFilters) =>
    queryOptions({
      queryKey: [...all, 'list', filters ?? {}],
      queryFn: ({ signal }) => transactionsApi.list(filters, { signal }).then((res) => res.data),
    }),
}

export const useTransactions = (filters?: TransactionFilters) => useQuery(transactionQueries.list(filters))

const invalidateTransactions = () => queryClient.invalidateQueries({ queryKey: all })

export const useCreateTransaction = () =>
  useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateTransactionInput; idempotencyKey: string }) =>
      transactionsApi.create(data, idempotencyKey),
    onSuccess: invalidateTransactions,
  })

export const useUpdateTransaction = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionInput }) => transactionsApi.update(id, data),
    onSuccess: invalidateTransactions,
  })

export const useDeleteTransaction = () =>
  useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: invalidateTransactions,
  })
