import api, { type RequestOptions } from '@/lib/axios'
import type { CreateInvoiceInput, Invoice, InvoiceFilters, InvoiceWithNames } from '@/types/invoice'

const PREFIX = '/invoices'

export const invoicesApi = {
  list: (filters?: InvoiceFilters, options?: RequestOptions) =>
    api.get<InvoiceWithNames[]>(PREFIX, { params: filters, ...options }),
  get: (id: number, options?: RequestOptions) => api.get<InvoiceWithNames>(`${PREFIX}/${id}`, options),
  create: (data: CreateInvoiceInput, idempotencyKey?: string) =>
    api.post<Invoice>(PREFIX, data, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    }),
}
