import { FileSpreadsheet, Plus } from 'lucide-react'
import { useState } from 'react'
import { useInvoices } from '@/api/invoices/queries'
import { Content, Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { ListRow } from '@/components/ui/ListRow'
import { Sheet } from '@/components/ui/Sheet'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import type { InvoiceWithNames } from '@/types/invoice'
import { toJalaliDate } from '@/utils/jalali'
import { formatToman, toPersianDigits } from '@/utils/persianDigits'
import { InvoiceForm } from './InvoiceForm'
import { InvoicePreview } from './InvoicePreview'

export function InvoicesPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === 'admin')
  const [createOpen, setCreateOpen] = useState(false)
  const [previewing, setPreviewing] = useState<InvoiceWithNames | null>(null)

  const invoices = useInvoices()

  return (
    <div>
      <Topbar
        title="فاکتورها"
        actions={
          isAdmin && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> صدور فاکتور جدید
            </Button>
          )
        }
      />
      <Content>
        {invoices.isLoading && <Spinner />}
        {invoices.isError && <ErrorBanner message={getApiErrorMessage(invoices.error)} />}
        {invoices.data && (
          <Card>
            {invoices.data.map((inv) => (
              <ListRow
                key={inv.id}
                onClick={() => setPreviewing(inv)}
                chevron
                avatar={
                  <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand-dark">
                    <FileSpreadsheet className="size-4" />
                  </div>
                }
                title={inv.invoice_number ? toPersianDigits(inv.invoice_number) : '—'}
                subtitle={`${inv.customer_name ?? 'بدون مشتری'} · ${toJalaliDate(inv.issued_at)}`}
                side={<span className="tabular-fa font-bold">{formatToman(inv.amount)}ت</span>}
              />
            ))}
            {invoices.data.length === 0 && <p className="p-8 text-center text-xs text-muted">فاکتوری صادر نشده است</p>}
          </Card>
        )}
      </Content>

      <Sheet open={createOpen} onOpenChange={setCreateOpen} title="صدور فاکتور جدید">
        <InvoiceForm onDone={() => setCreateOpen(false)} />
      </Sheet>

      <Sheet open={previewing !== null} onOpenChange={(open) => !open && setPreviewing(null)} title="فاکتور">
        {previewing && <InvoicePreview invoice={previewing} />}
      </Sheet>
    </div>
  )
}
