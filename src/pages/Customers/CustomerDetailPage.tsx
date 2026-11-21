import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCustomer } from '@/api/customers/queries'
import { Content, Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Sheet } from '@/components/ui/Sheet'
import { Spinner } from '@/components/ui/Spinner'
import { getApiErrorMessage } from '@/lib/apiError'
import { useAuthStore } from '@/store/authStore'
import { toJalaliDate } from '@/utils/jalali'
import { formatToman, toPersianDigits } from '@/utils/persianDigits'
import { AccountDetailSheet } from './AccountDetailSheet'
import { CustomerAccountForm } from './CustomerAccountForm'
import { CustomerForm } from './CustomerForm'

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const customerId = Number(id)
  const isAdmin = useAuthStore((state) => state.partner?.role === 'admin')

  const customer = useCustomer(customerId)
  const [editOpen, setEditOpen] = useState(false)
  const [newAccountOpen, setNewAccountOpen] = useState(false)
  const [openAccountId, setOpenAccountId] = useState<number | null>(null)

  if (customer.isLoading) return <Spinner className="m-6" />
  if (customer.isError) return <ErrorBanner message={getApiErrorMessage(customer.error)} />
  if (!customer.data) return null

  return (
    <div>
      <Topbar
        title={
          <span className="flex items-center gap-2">
            {customer.data.name}
            {isAdmin && (
              <button onClick={() => setEditOpen(true)} className="text-muted hover:text-edit" aria-label="ویرایش مشتری">
                <Pencil className="size-3.5" />
              </button>
            )}
          </span>
        }
        description={customer.data.phone ? toPersianDigits(customer.data.phone) : 'بدون شماره تماس'}
        actions={
          isAdmin && (
            <Button size="sm" onClick={() => setNewAccountOpen(true)}>
              <Plus className="size-4" /> حساب قسطی جدید
            </Button>
          )
        }
      />
      <Content>
        <h2 className="text-[14.5px] font-bold">حساب‌های قسطی</h2>
        <div className="flex flex-col gap-3">
          {customer.data.accounts.map((account) => {
            const paid = Number(account.paid_amount)
            const total = Number(account.total_amount)
            const open = paid < total
            return (
              <div
                key={account.id}
                className="flex cursor-pointer flex-col gap-2 rounded-[14px] border border-border p-3.5 hover:border-brand/40"
                onClick={() => setOpenAccountId(account.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">{account.description || `حساب #${toPersianDigits(account.id)}`}</span>
                  <Chip tone={open ? 'pending' : 'done'}>{open ? 'باز' : 'تسویه‌شده'}</Chip>
                </div>
                <ProgressBar percent={(paid / total) * 100} />
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="tabular-fa">
                    {formatToman(paid)} از {formatToman(total)}ت
                  </span>
                  <span>{toJalaliDate(account.created_at)}</span>
                </div>
              </div>
            )
          })}
          {customer.data.accounts.length === 0 && <p className="p-8 text-center text-xs text-muted">حساب قسطی‌ای ثبت نشده است</p>}
        </div>
      </Content>

      <Sheet open={editOpen} onOpenChange={setEditOpen} title="ویرایش مشتری">
        <CustomerForm customer={customer.data} onDone={() => setEditOpen(false)} />
      </Sheet>

      <Sheet open={newAccountOpen} onOpenChange={setNewAccountOpen} title="حساب قسطی جدید">
        <CustomerAccountForm customerId={customerId} onDone={() => setNewAccountOpen(false)} />
      </Sheet>

      <AccountDetailSheet accountId={openAccountId} onClose={() => setOpenAccountId(null)} />
    </div>
  )
}
