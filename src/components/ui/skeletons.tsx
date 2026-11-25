import type { ReactElement } from "react";
import { Skeleton } from "./Skeleton";

/** Matches the layout of StatTile. */
export function StatTileSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 rounded-[14px] border border-border bg-surface-alt p-3.5">
      <Skeleton className="h-[11.5px] w-16" />
      <Skeleton className="h-[19px] w-24" />
    </div>
  );
}

/** Matches the layout of TxRow. */
export function TxRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
      <Skeleton className="size-[34px] shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-[13px] w-32" />
        <Skeleton className="h-[11.5px] w-20" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Skeleton className="h-[13.5px] w-16" />
        <Skeleton className="h-[10.5px] w-20" />
      </div>
    </div>
  );
}

/** Matches the layout of ListRow. */
export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-0">
      <Skeleton className="size-[34px] shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-[13px] w-28" />
        <Skeleton className="h-[11.5px] w-36" />
      </div>
      <Skeleton className="h-5 w-16 shrink-0" />
    </div>
  );
}

/** Matches the layout of LedgerCard. */
export function LedgerCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 border-b border-border p-3.5 last:border-0">
      <div className="flex w-full items-center justify-between gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex w-full items-center justify-center gap-3">
        <Skeleton className="h-[13px] w-20" />
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-[13px] w-20" />
      </div>
      <Skeleton className="h-[17px] w-28" />
    </div>
  );
}

/** Matches the progress-bar account card used on CustomerDetailPage/AccountDetailSheet. */
export function AccountCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-border p-3.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-[13px] w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-[7px] w-full rounded-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Repeats a skeleton row `count` times, e.g. <SkeletonList count={5} item={TxRowSkeleton} />. */
export function SkeletonList({ count, item: Item }: { count: number; item: () => ReactElement }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} />
      ))}
    </>
  );
}
