import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { invoicesApi } from './index'
import { queryClient } from '@/lib/queryClient'
import type { CreateInvoiceInput, InvoiceFilters } from '@/types/invoice'

const all = ['invoices'] as const

export const invoiceQueries = {
  all,
  list: (filters?: InvoiceFilters) =>
    queryOptions({
      queryKey: [...all, 'list', filters ?? {}],
      queryFn: ({ signal }) => invoicesApi.list(filters, { signal }).then((res) => res.data),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...all, 'detail', id],
      queryFn: ({ signal }) => invoicesApi.get(id, { signal }).then((res) => res.data),
      enabled: Boolean(id),
    }),
}

export const useInvoices = (filters?: InvoiceFilters) => useQuery(invoiceQueries.list(filters))
export const useInvoice = (id: number) => useQuery(invoiceQueries.detail(id))

export const useCreateInvoice = () =>
  useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateInvoiceInput; idempotencyKey: string }) =>
      invoicesApi.create(data, idempotencyKey),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: all }),
  })
