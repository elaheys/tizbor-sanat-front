import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreateCustomerAccountInput,
  CreateCustomerInput,
  CreateCustomerPaymentInput,
  Customer,
  CustomerAccountDetail,
  CustomerDetail,
  CustomerPayment,
  UpdateCustomerInput,
} from "@/types/customer";
import type { CustomerAccountSummary } from "@/types/customer";
import type { Page } from "@/types/pagination";

const PREFIX = "/customers";
const ACCOUNTS_PREFIX = "/customer-accounts";
const PAGE_SIZE = 10;

export const customersApi = {
  list: (q?: string, options?: RequestOptions) =>
    api.get<Customer[]>(PREFIX, { params: { q }, ...options }),
  listPage: (q: string | undefined, page: number, options?: RequestOptions) =>
    api
      .get<Page<Customer>>(PREFIX, { params: { q, page, limit: PAGE_SIZE }, ...options })
      .then((res) => res.data),
  get: (id: number, options?: RequestOptions) =>
    api.get<CustomerDetail>(`${PREFIX}/${id}`, options),
  create: (data: CreateCustomerInput) => api.post<Customer>(PREFIX, data),
  update: (id: number, data: UpdateCustomerInput) => api.patch<Customer>(`${PREFIX}/${id}`, data),
  delete: (id: number) => api.delete<void>(`${PREFIX}/${id}`),
};

export const customerAccountsApi = {
  create: (data: CreateCustomerAccountInput, idempotencyKey?: string) =>
    api.post<CustomerAccountSummary>(ACCOUNTS_PREFIX, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
  get: (id: number, options?: RequestOptions) =>
    api.get<CustomerAccountDetail>(`${ACCOUNTS_PREFIX}/${id}`, options),
  addPayment: (accountId: number, data: CreateCustomerPaymentInput, idempotencyKey?: string) =>
    api.post<CustomerPayment>(`${ACCOUNTS_PREFIX}/${accountId}/payments`, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
};
