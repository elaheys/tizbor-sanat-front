import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  TransactionWithNames,
  UpdateTransactionInput,
} from "@/types/transaction";
import type { Page } from "@/types/pagination";

const PREFIX = "/transactions";
const PAGE_SIZE = 10;

export const transactionsApi = {
  list: (filters?: TransactionFilters, options?: RequestOptions) =>
    api.get<TransactionWithNames[]>(PREFIX, { params: filters, ...options }),
  listPage: (filters: TransactionFilters | undefined, page: number, options?: RequestOptions) =>
    api
      .get<Page<TransactionWithNames>>(PREFIX, {
        params: { ...filters, page, limit: PAGE_SIZE },
        ...options,
      })
      .then((res) => res.data),
  create: (data: CreateTransactionInput, idempotencyKey?: string) =>
    api.post<Transaction>(PREFIX, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
  update: (id: number, data: UpdateTransactionInput) =>
    api.patch<Transaction>(`${PREFIX}/${id}`, data),
  delete: (id: number) => api.delete<void>(`${PREFIX}/${id}`),
};
