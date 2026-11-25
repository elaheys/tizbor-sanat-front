import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export { Provider as TooltipProvider } from "@radix-ui/react-tooltip";

// Built on Radix's Tooltip (not plain CSS): its content is portaled straight to
// <body>, so it can't get clipped by a Card's overflow-hidden or a Sheet's
// overflow-y-auto body, and it always paints above everything else since it mounts
// its own top-level layer on hover instead of competing on z-index with Select/Sheet.
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={6}
          className="z-100 rounded-md bg-brand-dark px-2 py-1 text-[11px] font-medium text-surface shadow-md"
        >
          {label}
          <RadixTooltip.Arrow className="fill-brand-dark" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
