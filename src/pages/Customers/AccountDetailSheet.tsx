import { useState } from 'react'
import { useCustomerAccount } from '@/api/customers/queries'
import { Chip } from '@/components/ui/Chip'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Sheet } from '@/components/ui/Sheet'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import { toJalaliDate } from '@/utils/jalali'
import { formatToman } from '@/utils/persianDigits'
import { PaymentForm } from './PaymentForm'

export function AccountDetailSheet({ accountId, onClose }: { accountId: number | null; onClose: () => void }) {
  const isAdmin = useAuthStore((state) => state.partner?.role === 'admin')
  const account = useCustomerAccount(accountId ?? 0)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  return (
    <Sheet
      open={accountId !== null}
      onOpenChange={(open) => {
        if (!open) {
          setShowPaymentForm(false)
          onClose()
        }
      }}
      title="جزئیات حساب قسطی"
    >
      {account.isLoading && <Spinner />}
      {account.isError && <ErrorBanner message={getApiErrorMessage(account.error)} />}
      {account.data && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 rounded-[14px] border border-border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold">{account.data.description || 'حساب قسطی'}</span>
              <Chip tone={account.data.remaining_balance > 0 ? 'pending' : 'done'}>
                {account.data.remaining_balance > 0 ? 'باز' : 'تسویه‌شده'}
              </Chip>
            </div>
            <ProgressBar percent={(account.data.paid_amount / Number(account.data.total_amount)) * 100} />
            <div className="flex justify-between text-xs text-muted">
              <span>مبلغ کل</span>
              <b className="tabular-fa font-bold text-ink">{formatToman(account.data.total_amount)}ت</b>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>پرداخت‌شده</span>
              <b className="tabular-fa font-bold text-ink">{formatToman(account.data.paid_amount)}ت</b>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>ماندهٔ باقی</span>
              <b className="tabular-fa font-bold text-danger">{formatToman(account.data.remaining_balance)}ت</b>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted">تاریخچهٔ پرداخت‌ها</h3>
            <div className="overflow-hidden rounded-[14px] border border-border">
              {account.data.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-border px-3.5 py-2.5 text-[13px] last:border-0">
                  <span className="tabular-fa font-bold text-brand-dark">{formatToman(p.amount)}ت</span>
                  <span className="tabular-fa text-[11px] text-muted">{toJalaliDate(p.paid_at)}</span>
                </div>
              ))}
              {account.data.payments.length === 0 && <p className="p-5 text-center text-xs text-muted">هنوز پرداختی ثبت نشده است</p>}
            </div>
          </div>

          {isAdmin && account.data.remaining_balance > 0 && (
            <div>
              {showPaymentForm ? (
                <PaymentForm accountId={account.data.id} onDone={() => setShowPaymentForm(false)} />
              ) : (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full rounded-[11px] bg-brand py-2.5 text-[13.5px] font-semibold text-white"
                >
                  + ثبت پرداخت جدید
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Sheet>
  )
}
