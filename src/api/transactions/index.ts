import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  TransactionWithNames,
  UpdateTransactionInput,
} from "@/types/transaction";

const PREFIX = "/transactions";

export const transactionsApi = {
  list: (filters?: TransactionFilters, options?: RequestOptions) =>
    api.get<TransactionWithNames[]>(PREFIX, { params: filters, ...options }),
  create: (data: CreateTransactionInput, idempotencyKey?: string) =>
    api.post<Transaction>(PREFIX, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
  update: (id: number, data: UpdateTransactionInput) =>
    api.patch<Transaction>(`${PREFIX}/${id}`, data),
  delete: (id: number) => api.delete<void>(`${PREFIX}/${id}`),
};
