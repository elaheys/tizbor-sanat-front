import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCustomers } from '@/api/customers/queries'
import { useCreateInvoice } from '@/api/invoices/queries'
import { usePartners } from '@/api/partners/queries'
import { AmountInput } from '@/components/ui/AmountInput'
import { Button } from '@/components/ui/Button'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { getApiErrorMessage } from '@/lib/apiError'
import { newIdempotencyKey } from '@/utils/idempotencyKey'
import { selectablePartners } from '@/utils/partners'

const schema = z.object({
  partner_id: z.string().min(1, 'شریک را انتخاب کنید'),
  customer_id: z.string().optional(),
  amount: z.number().positive('مبلغ باید بزرگتر از صفر باشد'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function InvoiceForm({ onDone }: { onDone: () => void }) {
  const partners = usePartners()
  const customers = useCustomers()
  const createInvoice = useCreateInvoice()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partner_id: '', customer_id: '', amount: 0, description: '' },
  })

  const onSubmit = handleSubmit((values) => {
    createInvoice.mutate(
      {
        data: {
          partner_id: Number(values.partner_id),
          customer_id: values.customer_id ? Number(values.customer_id) : undefined,
          amount: values.amount,
          description: values.description || undefined,
        },
        idempotencyKey: newIdempotencyKey(),
      },
      { onSuccess: onDone },
    )
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>شریک</Label>
        <Controller
          control={control}
          name="partner_id"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب شریک"
              error={errors.partner_id?.message}
              options={selectablePartners(partners.data ?? []).map((p) => ({ value: String(p.id), label: p.name }))}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>مشتری (اختیاری)</Label>
        <Controller
          control={control}
          name="customer_id"
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="بدون مشتری"
              options={(customers.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">مبلغ</Label>
        <AmountInput id="amount" {...register('amount', { valueAsNumber: true })} error={errors.amount?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">توضیحات (اختیاری)</Label>
        <Textarea id="description" {...register('description')} />
      </div>

      {createInvoice.isError && <ErrorBanner message={getApiErrorMessage(createInvoice.error)} />}

      <Button type="submit" disabled={createInvoice.isPending} className="mt-2">
        {createInvoice.isPending ? 'در حال صدور...' : 'صدور فاکتور'}
      </Button>
    </form>
  )
}
