import { Minus, Plus } from "lucide-react";
import { toPersianDigits } from "@/utils/persianDigits";

export function Stepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-[26px] items-center justify-center rounded-full border border-border bg-surface-alt font-bold text-ink"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="tabular-fa min-w-5 text-center font-bold">{toPersianDigits(value)}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex size-[26px] items-center justify-center rounded-full border border-border bg-surface-alt font-bold text-ink"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
