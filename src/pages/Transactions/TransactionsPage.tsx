import { Plus } from 'lucide-react'
import { useState } from 'react'
import { usePartners } from '@/api/partners/queries'
import { useDeleteTransaction, useTransactions } from '@/api/transactions/queries'
import { Content, Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Select } from '@/components/ui/Select'
import { Sheet } from '@/components/ui/Sheet'
import { Spinner } from '@/components/ui/Spinner'
import { TxRow } from '@/components/ui/TxRow'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import { TRANSACTION_TYPES, type TransactionFilters, type TransactionWithNames } from '@/types/transaction'
import { transactionTypeLabels } from '@/utils/labels'
import { selectablePartners } from '@/utils/partners'
import { TransactionForm } from './TransactionForm'

export function TransactionsPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === 'admin')
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<TransactionWithNames | undefined>(undefined)

  const partners = usePartners()
  const transactions = useTransactions(filters)
  const deleteTx = useDeleteTransaction()

  const openCreate = () => {
    setEditing(undefined)
    setSheetOpen(true)
  }

  const openEdit = (tx: TransactionWithNames) => {
    setEditing(tx)
    setSheetOpen(true)
  }

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
              value={filters.type ?? ''}
              onChange={(v) => setFilters((f) => ({ ...f, type: (v || undefined) as TransactionFilters['type'] }))}
              placeholder="همهٔ انواع"
              options={TRANSACTION_TYPES.map((t) => ({ value: t, label: transactionTypeLabels[t] }))}
            />
          </div>
          <div className="w-40">
            <Select
              value={filters.partner_id ? String(filters.partner_id) : ''}
              onChange={(v) => setFilters((f) => ({ ...f, partner_id: v ? Number(v) : undefined }))}
              placeholder="همهٔ شرکا"
              options={selectablePartners(partners.data ?? [], filters.partner_id ? String(filters.partner_id) : undefined).map((p) => ({
                value: String(p.id),
                label: p.name,
              }))}
            />
          </div>
        </div>

        {transactions.isLoading && <Spinner />}
        {transactions.isError && <ErrorBanner message={getApiErrorMessage(transactions.error)} />}
        {transactions.data && (
          <Card>
            {transactions.data.map((tx) => (
              <TxRow key={tx.id} tx={tx} onEdit={isAdmin ? () => openEdit(tx) : undefined} />
            ))}
            {transactions.data.length === 0 && <p className="p-8 text-center text-xs text-muted">تراکنشی ثبت نشده است</p>}
          </Card>
        )}
      </Content>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title={editing ? 'ویرایش تراکنش' : 'ثبت تراکنش جدید'}>
        <TransactionForm transaction={editing} onDone={() => setSheetOpen(false)} />
        {editing && (
          <button
            onClick={() => {
              if (confirm('این تراکنش حذف شود؟')) {
                deleteTx.mutate(editing.id, { onSuccess: () => setSheetOpen(false) })
              }
            }}
            className="mt-2 w-full text-center text-[11.5px] font-semibold text-danger"
          >
            حذف این تراکنش
          </button>
        )}
      </Sheet>
    </div>
  )
}
