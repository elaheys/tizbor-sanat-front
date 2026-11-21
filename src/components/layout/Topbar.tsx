import type { ReactNode } from "react";

export function Topbar({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 md:px-5.5">
      <div>
        <div className="text-base font-bold text-ink">{title}</div>
        {description && <div className="mt-0.5 text-[11.5px] text-muted">{description}</div>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function Content({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5.5 px-4 pb-24 pt-4 md:px-5.5 md:pb-6 md:pt-5">
      {children}
    </div>
  );
}
