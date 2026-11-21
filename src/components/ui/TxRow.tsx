import { Pencil } from "lucide-react";
import { TxIcon } from "./TxIcon";
import type { TransactionWithNames } from "@/types/transaction";
import { toRelativeTime } from "@/utils/jalali";
import { transactionTypeLabels } from "@/utils/labels";
import { formatToman } from "@/utils/persianDigits";

const REVENUE_TYPES = new Set(["sale", "repair", "exchange"]);

export function TxRow({ tx, onEdit }: { tx: TransactionWithNames; onEdit?: () => void }) {
  const isRevenue = REVENUE_TYPES.has(tx.type);
  return (
    <div className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
      <TxIcon type={tx.type} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-ink">
          {transactionTypeLabels[tx.type]} — {tx.scissor_type}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-muted">
          {[tx.customer_name, tx.partner_name].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div className="shrink-0 text-start">
        <span
          className={`tabular-fa text-[13.5px] font-bold ${isRevenue ? "text-brand-dark" : "text-danger"}`}
        >
          {formatToman(tx.amount)}ت
        </span>
        <span className="mt-0.5 block text-[10.5px] text-muted">
          {toRelativeTime(tx.created_at)}
        </span>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-edit-soft bg-edit-soft text-edit"
          aria-label="ویرایش تراکنش"
        >
          <Pencil className="size-3.5" />
        </button>
      )}
    </div>
  );
}
