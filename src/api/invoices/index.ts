import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreateInvoiceInput,
  Invoice,
  InvoiceFilters,
  InvoiceWithNames,
} from "@/types/invoice";
import type { Page } from "@/types/pagination";

const PREFIX = "/invoices";
const PAGE_SIZE = 10;

export const invoicesApi = {
  list: (filters?: InvoiceFilters, options?: RequestOptions) =>
    api.get<InvoiceWithNames[]>(PREFIX, { params: filters, ...options }),
  listPage: (filters: InvoiceFilters | undefined, page: number, options?: RequestOptions) =>
    api
      .get<Page<InvoiceWithNames>>(PREFIX, {
        params: { ...filters, page, limit: PAGE_SIZE },
        ...options,
      })
      .then((res) => res.data),
  get: (id: number, options?: RequestOptions) =>
    api.get<InvoiceWithNames>(`${PREFIX}/${id}`, options),
  create: (data: CreateInvoiceInput, idempotencyKey?: string) =>
    api.post<Invoice>(PREFIX, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
};
