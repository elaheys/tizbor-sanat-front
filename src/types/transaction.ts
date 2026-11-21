export type TransactionType = "sale" | "purchase" | "repair" | "exchange";

export const TRANSACTION_TYPES: TransactionType[] = ["sale", "purchase", "repair", "exchange"];

export interface Transaction {
  id: number;
  type: TransactionType;
  scissor_type: string;
  customer_id: number | null;
  partner_id: number;
  amount: string;
  quantity: number;
  note: string | null;
  created_at: string;
}

export interface TransactionWithNames extends Transaction {
  customer_name: string | null;
  partner_name: string;
}

export interface TransactionFilters {
  partner_id?: number;
  type?: TransactionType;
  from?: string;
  to?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  scissor_type: string;
  customer_id?: number;
  partner_id: number;
  amount: number;
  quantity?: number;
  note?: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  scissor_type?: string;
  customer_id?: number | null;
  partner_id?: number;
  amount?: number;
  quantity?: number;
  note?: string;
}
