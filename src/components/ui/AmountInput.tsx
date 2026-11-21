import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface AmountInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, error, onFocus, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-[10px] border border-border bg-surface px-3 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-soft",
          error && "border-danger",
        )}
      >
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          onFocus={(e) => {
            e.target.select();
            onFocus?.(e);
          }}
          className={cn(
            "tabular-fa w-full bg-transparent text-[15px] font-bold text-ink outline-none",
            className,
          )}
          {...props}
        />
        <span className="shrink-0 text-[11.5px] font-semibold text-muted">تومان</span>
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  ),
);
AmountInput.displayName = "AmountInput";
