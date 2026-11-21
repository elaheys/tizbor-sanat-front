import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone =
  "loan" | "settlement" | "pending" | "done" | "active" | "inactive" | "balance" | "brand";

const toneClasses: Record<Tone, string> = {
  loan: "bg-accent-soft text-accent-ink",
  settlement: "bg-brand-soft text-brand-dark",
  pending: "bg-danger-soft text-danger",
  done: "bg-[#E7E2D6] text-muted",
  active: "bg-brand-soft text-brand-dark",
  inactive: "bg-[#E7E2D6] text-muted",
  balance: "bg-danger-soft text-danger tabular-fa",
  brand: "bg-brand-soft text-brand-dark",
};

export function Chip({
  tone = "brand",
  className,
  ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-[3px] text-[10.5px] font-bold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
