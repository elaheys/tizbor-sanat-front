import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, onFocus, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        className={cn(
          "h-9.5 w-full rounded-[10px] border border-border bg-surface px-3 text-[13px] text-ink outline-none transition-colors",
          "focus:border-brand focus:ring-2 focus:ring-brand-soft",
          error && "border-danger focus:border-danger focus:ring-danger-soft",
          className,
        )}
        onFocus={(e) => {
          if (props.type === "number") e.target.select();
          onFocus?.(e);
        }}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  ),
);
Input.displayName = "Input";
