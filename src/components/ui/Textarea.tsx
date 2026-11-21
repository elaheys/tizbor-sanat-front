import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 3, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full resize-y rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none transition-colors",
          "focus:border-brand focus:ring-2 focus:ring-brand-soft",
          error && "border-danger focus:border-danger focus:ring-danger-soft",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  ),
);
Textarea.displayName = "Textarea";
