import type { TransactionType } from "@/types/transaction";
import type { LedgerEntryType } from "@/types/ledger";

export const transactionTypeLabels: Record<TransactionType, string> = {
  sale: "فروش",
  purchase: "خرید",
  repair: "تعمیر",
  exchange: "تعویض",
};

export const ledgerTypeLabels: Record<LedgerEntryType, string> = {
  loan: "قرض",
  profit_settlement: "تسویه سود",
};
