import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LedgerFlow } from "./LedgerFlow";
import { formatToman } from "@/utils/persianDigits";

export function LedgerCard({
  fromName,
  toName,
  amount,
  chips,
  actions,
  metaLeft,
  metaRight,
  dimmed,
  children,
}: {
  fromName: string;
  toName: string;
  amount: string | number;
  chips?: ReactNode;
  actions?: ReactNode;
  metaLeft?: ReactNode;
  metaRight?: ReactNode;
  dimmed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn("border-b border-border p-3.5 last:border-0", dimmed && "opacity-70")}>
      {(chips || actions) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">{chips}</div>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
      )}
      <LedgerFlow fromName={fromName} toName={toName} />
      <div className="tabular-fa my-1 text-center text-[17px] font-extrabold">
        {formatToman(amount)} تومان
      </div>
      {(metaLeft || metaRight) && (
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
          <span className="min-w-0 truncate">{metaLeft}</span>
          {metaRight && <span className="shrink-0">{metaRight}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
