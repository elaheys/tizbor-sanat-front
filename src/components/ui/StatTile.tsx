import { cn } from "@/lib/cn";
import { formatToman } from "@/utils/persianDigits";

export function StatTile({
  label,
  amount,
  primary,
}: {
  label: string;
  amount: number | string;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-[14px] border p-3.5",
        primary ? "border-brand bg-brand" : "border-border bg-surface-alt",
      )}
    >
      <span className={cn("text-[11.5px]", primary ? "text-brand-ink-tint" : "text-muted")}>
        {label}
      </span>
      <span
        className={cn(
          "tabular-fa text-[19px] font-extrabold leading-tight",
          primary ? "text-white" : "text-ink",
        )}
      >
        {formatToman(amount)}
        <span
          className={cn(
            "ms-1 text-[11px] font-medium",
            primary ? "text-brand-ink-tint" : "text-muted",
          )}
        >
          تومان
        </span>
      </span>
    </div>
  );
}
