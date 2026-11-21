import api, { type RequestOptions } from "@/lib/axios";
import type {
  CreateLoanInput,
  LedgerFilters,
  PartnerLedgerEntry,
  PartnerLedgerEntryWithNames,
  UpdateLedgerEntryInput,
} from "@/types/ledger";

const LEDGER_PREFIX = "/partner-ledger";
const LOANS_PREFIX = "/loans";

export const partnerLedgerApi = {
  list: (filters?: LedgerFilters, options?: RequestOptions) =>
    api.get<PartnerLedgerEntryWithNames[]>(LEDGER_PREFIX, { params: filters, ...options }),
  history: (from?: string, to?: string, options?: RequestOptions) =>
    api.get<PartnerLedgerEntryWithNames[]>(`${LEDGER_PREFIX}/history`, {
      params: { from, to },
      ...options,
    }),
  update: (id: number, data: UpdateLedgerEntryInput) =>
    api.patch<PartnerLedgerEntry>(`${LEDGER_PREFIX}/${id}`, data),
  delete: (id: number) => api.delete<void>(`${LEDGER_PREFIX}/${id}`),
  settle: (id: number) => api.patch<PartnerLedgerEntry>(`${LEDGER_PREFIX}/${id}/settle`),
};

export const loansApi = {
  create: (data: CreateLoanInput, idempotencyKey?: string) =>
    api.post<PartnerLedgerEntry>(LOANS_PREFIX, data, {
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
    }),
};
