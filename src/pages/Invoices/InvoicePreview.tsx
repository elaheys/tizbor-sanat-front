import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toJalaliDate } from '@/utils/jalali'
import { formatToman, toPersianDigits } from '@/utils/persianDigits'
import type { InvoiceWithNames } from '@/types/invoice'

export function InvoicePreview({ invoice }: { invoice: InvoiceWithNames }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div id="invoice-print-area" className="flex flex-col gap-3.5 rounded-md border border-dashed border-border p-4.5">
        <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
          <div>
            <div className="tabular-fa text-[15px] font-extrabold">{invoice.invoice_number ? toPersianDigits(invoice.invoice_number) : '—'}</div>
            <div className="mt-0.5 text-[11px] text-muted">{toJalaliDate(invoice.issued_at)}</div>
          </div>
          <div className="flex size-7.5 items-center justify-center rounded-[10px] bg-accent text-[13px] font-extrabold text-white">ت</div>
        </div>

        <div className="flex flex-col gap-1.5 text-[12.5px]">
          <div className="flex justify-between text-muted">
            <span>مشتری</span>
            <b className="font-semibold text-ink">{invoice.customer_name ?? 'بدون مشتری'}</b>
          </div>
          <div className="flex justify-between text-muted">
            <span>صادرکننده</span>
            <b className="font-semibold text-ink">{invoice.partner_name}</b>
          </div>
        </div>

        {invoice.description && (
          <div className="flex flex-col gap-1.5 border-t border-dashed border-border py-2 text-[13px]">
            <span className="min-w-0 whitespace-pre-wrap wrap-break-word">{invoice.description}</span>
            {/* <b className="tabular-fa self-end font-bold">{formatToman(invoice.amount)}ت</b> */}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-[12.5px] text-muted">جمع کل</span>
          <span className="tabular-fa text-[19px] font-extrabold text-brand-dark">{formatToman(invoice.amount)} تومان</span>
        </div>
      </div>

      <Button onClick={() => window.print()} variant="secondary">
        <Printer className="size-4" /> چاپ فاکتور
      </Button>
    </div>
  )
}
