export type LedgerEntryType = "loan" | "profit_settlement";

export interface PartnerLedgerEntry {
  id: number;
  from_partner_id: number;
  to_partner_id: number;
  amount: string;
  type: LedgerEntryType;
  entry_date: string;
  period_year: number | null;
  period_month: number | null;
  note: string | null;
  is_settled: boolean;
  settled_at: string | null;
  created_at: string;
}

export interface PartnerLedgerEntryWithNames extends PartnerLedgerEntry {
  from_partner_name: string;
  to_partner_name: string;
}

export interface LedgerFilters {
  is_settled?: boolean;
  type?: LedgerEntryType;
  partner_id?: number;
}

export interface CreateLoanInput {
  from_partner_id: number;
  to_partner_id: number;
  amount: number;
  loan_date?: string;
  note?: string;
}

export interface UpdateLedgerEntryInput {
  amount?: number;
  entry_date?: string;
  note?: string;
}
