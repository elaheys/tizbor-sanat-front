import * as Tabs from '@radix-ui/react-tabs'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  useDeleteLedgerEntry,
  usePartnerLedger,
  usePartnerLedgerHistory,
  useSettleLedgerEntry,
  useUpdateLedgerEntry,
} from '@/api/partnerLedger/queries'
import { Content, Topbar } from '@/components/layout/Topbar'
import { AmountInput } from '@/components/ui/AmountInput'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { LedgerCard } from '@/components/ui/LedgerCard'
import { Sheet } from '@/components/ui/Sheet'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import type { PartnerLedgerEntryWithNames } from '@/types/ledger'
import { toJalaliDate } from '@/utils/jalali'
import { ledgerTypeLabels } from '@/utils/labels'
import { LoanForm } from './LoanForm'

function LedgerEditRow({ entry, onDone }: { entry: PartnerLedgerEntryWithNames; onDone: () => void }) {
  const update = useUpdateLedgerEntry()
  const [amount, setAmount] = useState(Number(entry.amount))

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <AmountInput value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      {update.isError && <ErrorBanner message={getApiErrorMessage(update.error)} />}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={onDone}>
          انصراف
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={update.isPending}
          onClick={() => update.mutate({ id: entry.id, data: { amount } }, { onSuccess: onDone })}
        >
          ذخیره
        </Button>
      </div>
    </div>
  )
}

export function LedgerPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === 'admin')
  const [viewAsPartner, setViewAsPartner] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tab, setTab] = useState<'open' | 'history'>('open')
  const [editingId, setEditingId] = useState<number | null>(null)

  const open = usePartnerLedger({ is_settled: false })
  const history = usePartnerLedgerHistory()
  const settle = useSettleLedgerEntry()
  const deleteEntry = useDeleteLedgerEntry()

  const showAdminActions = isAdmin && !viewAsPartner
  const rows = tab === 'open' ? open.data : history.data
  const isLoading = tab === 'open' ? open.isLoading : history.isLoading
  const isError = tab === 'open' ? open.isError : history.isError
  const error = tab === 'open' ? open.error : history.error

  return (
    <div>
      <Topbar
        title="قرض و تسویه"
        description="همهٔ مانده‌های بین شرکا"
        actions={
          isAdmin && (
            <label className="flex items-center gap-2 text-[11.5px] text-muted">
              نمایش به‌عنوان شریک
              <button
                type="button"
                onClick={() => setViewAsPartner((v) => !v)}
                className={cn('relative h-[19px] w-[34px] rounded-full transition-colors', viewAsPartner ? 'bg-brand' : 'bg-border')}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-[15px] rounded-full bg-white shadow transition-all',
                    viewAsPartner ? 'left-[17px]' : 'left-0.5',
                  )}
                />
              </button>
            </label>
          )
        }
      />
      <Content>
        <Tabs.Root value={tab} onValueChange={(v) => setTab(v as 'open' | 'history')}>
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <Tabs.List className="inline-flex gap-0.5 rounded-[11px] border border-border bg-surface-alt p-[3px]">
              <Tabs.Trigger
                value="open"
                className={cn('shadow-card rounded-[9px] px-4 py-2 text-xs font-semibold', tab === 'open' ? 'bg-surface text-ink' : 'text-muted')}
              >
                باز
              </Tabs.Trigger>
              <Tabs.Trigger
                value="history"
                className={cn('shadow-card rounded-[9px] px-4 py-2 text-xs font-semibold', tab === 'history' ? 'bg-surface text-ink' : 'text-muted')}
              >
                تاریخچه
              </Tabs.Trigger>
            </Tabs.List>
            {showAdminActions && (
              <Button size="sm" variant="secondary" onClick={() => setSheetOpen(true)}>
                <Plus className="size-4" /> ثبت قرض جدید
              </Button>
            )}
          </div>

          <div className="mt-4">
            {isLoading && <Spinner />}
            {isError && <ErrorBanner message={getApiErrorMessage(error)} />}
            {rows && (
              <Card>
                {rows.map((entry) => (
                  <LedgerCard
                    key={entry.id}
                    fromName={entry.from_partner_name}
                    toName={entry.to_partner_name}
                    amount={entry.amount}
                    dimmed={entry.is_settled}
                    chips={
                      <>
                        <Chip tone={entry.type === 'loan' ? 'loan' : 'settlement'}>{ledgerTypeLabels[entry.type]}</Chip>
                        <Chip tone={entry.is_settled ? 'done' : 'pending'}>{entry.is_settled ? 'تسویه‌شده' : 'در انتظار'}</Chip>
                      </>
                    }
                    actions={
                      tab === 'open' &&
                      showAdminActions && (
                        <>
                          <button
                            onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
                            className="flex size-7 items-center justify-center rounded-lg border border-edit-soft bg-edit-soft text-edit"
                            aria-label="ویرایش مانده"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => confirm('این مورد حذف شود؟') && deleteEntry.mutate(entry.id)}
                            className="flex size-7 items-center justify-center rounded-lg border border-danger-soft bg-danger-soft text-danger"
                            aria-label="حذف مانده"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )
                    }
                    metaLeft={entry.note ?? (entry.type === 'loan' ? 'قرض نقدی' : 'تسویهٔ سود')}
                    metaRight={
                      tab === 'open' && showAdminActions && editingId !== entry.id ? (
                        <button
                          onClick={() => settle.mutate(entry.id)}
                          className="rounded-md border border-border bg-surface px-3 py-1 text-[11.5px] font-semibold"
                        >
                          تسویه شد
                        </button>
                      ) : tab === 'history' ? (
                        <span className="tabular-fa">{toJalaliDate(entry.settled_at)}</span>
                      ) : null
                    }
                  >
                    {editingId === entry.id && <LedgerEditRow entry={entry} onDone={() => setEditingId(null)} />}
                  </LedgerCard>
                ))}
                {rows.length === 0 && <p className="p-8 text-center text-xs text-muted">{tab === 'open' ? 'موردی باز نیست' : 'تاریخچه‌ای وجود ندارد'}</p>}
              </Card>
            )}
          </div>
        </Tabs.Root>
      </Content>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="ثبت قرض جدید">
        <LoanForm onDone={() => setSheetOpen(false)} />
      </Sheet>
    </div>
  )
}
