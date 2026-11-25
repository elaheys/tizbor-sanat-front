import { Plus } from "lucide-react";
import { useState } from "react";
import { usePartners } from "@/api/partners/queries";
import { useDeleteTransaction, useTransactionsInfinite } from "@/api/transactions/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { InfiniteScrollSentinel } from "@/components/ui/InfiniteScrollSentinel";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { SkeletonList, TxRowSkeleton } from "@/components/ui/skeletons";
import { Spinner } from "@/components/ui/Spinner";
import { TxRow } from "@/components/ui/TxRow";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/authStore";
import {
  TRANSACTION_TYPES,
  type TransactionFilters,
  type TransactionWithNames,
} from "@/types/transaction";
import { transactionTypeLabels } from "@/utils/labels";
import { selectablePartners } from "@/utils/partners";
import { TransactionForm } from "./TransactionForm";

const ALL_TYPES = "__all_types__";
const ALL_PARTNERS = "__all_partners__";

export function TransactionsPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === "admin");
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionWithNames | undefined>(undefined);

  const partners = usePartners();
  const transactions = useTransactionsInfinite(filters);
  const deleteTx = useDeleteTransaction();
  const txRows = transactions.data?.pages.flatMap((p) => p.data) ?? [];

  const openCreate = () => {
    setEditing(undefined);
    setSheetOpen(true);
  };

  const openEdit = (tx: TransactionWithNames) => {
    setEditing(tx);
    setSheetOpen(true);
  };

  return (
    <div>
      <Topbar
        title="تراکنش‌ها"
        actions={
          isAdmin && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> ثبت تراکنش
            </Button>
          )
        }
      />
      <Content>
        <div className="flex flex-wrap gap-2.5">
          <div className="w-40">
            <Select
              value={filters.type ?? ALL_TYPES}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  type: v === ALL_TYPES ? undefined : (v as TransactionFilters["type"]),
                }))
              }
              options={[
                { value: ALL_TYPES, label: "همهٔ انواع" },
                ...TRANSACTION_TYPES.map((t) => ({
                  value: t,
                  label: transactionTypeLabels[t],
                })),
              ]}
            />
          </div>
          <div className="w-40">
            <Select
              value={filters.partner_id ? String(filters.partner_id) : ALL_PARTNERS}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  partner_id: v === ALL_PARTNERS ? undefined : Number(v),
                }))
              }
              options={[
                { value: ALL_PARTNERS, label: "همهٔ شرکا" },
                ...selectablePartners(
                  partners.data ?? [],
                  filters.partner_id ? String(filters.partner_id) : undefined,
                ).map((p) => ({
                  value: String(p.id),
                  label: p.name,
                })),
              ]}
            />
          </div>
        </div>

        {transactions.isLoading && (
          <Card>
            <SkeletonList count={5} item={TxRowSkeleton} />
          </Card>
        )}
        {transactions.isError && <ErrorBanner message={getApiErrorMessage(transactions.error)} />}
        {transactions.data && (
          <Card>
            {txRows.map((tx) => (
              <TxRow key={tx.id} tx={tx} onEdit={isAdmin ? () => openEdit(tx) : undefined} />
            ))}
            {txRows.length === 0 && (
              <p className="p-8 text-center text-xs text-muted">تراکنشی ثبت نشده است</p>
            )}
            {transactions.hasNextPage && (
              <>
                {transactions.isFetchingNextPage && (
                  <div className="flex justify-center p-4">
                    <Spinner />
                  </div>
                )}
                <InfiniteScrollSentinel
                  onIntersect={() => transactions.fetchNextPage()}
                  disabled={transactions.isFetchingNextPage}
                />
              </>
            )}
          </Card>
        )}
      </Content>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editing ? "ویرایش تراکنش" : "ثبت تراکنش جدید"}
      >
        <TransactionForm transaction={editing} onDone={() => setSheetOpen(false)} />
        {editing && (
          <button
            onClick={() => {
              if (confirm("این تراکنش حذف شود؟")) {
                deleteTx.mutate(editing.id, { onSuccess: () => setSheetOpen(false) });
              }
            }}
            className="mt-2 w-full text-center text-[11.5px] font-semibold text-danger"
          >
            حذف این تراکنش
          </button>
        )}
      </Sheet>
    </div>
  );
}
