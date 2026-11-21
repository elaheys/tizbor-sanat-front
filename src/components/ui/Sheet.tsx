import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="sheet-content fixed inset-y-0 start-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Dialog.Title className="text-[15px] font-bold text-ink">{title}</Dialog.Title>
            <Dialog.Close className="flex size-7 items-center justify-center rounded-full bg-surface-alt text-muted">
              <X className="size-3.5" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-4.5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
