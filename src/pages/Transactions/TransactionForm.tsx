import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePartners } from '@/api/partners/queries'
import { useCreateTransaction, useUpdateTransaction } from '@/api/transactions/queries'
import { AmountInput } from '@/components/ui/AmountInput'
import { Button } from '@/components/ui/Button'
import { CustomerCombobox } from '@/components/ui/CustomerCombobox'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Segmented } from '@/components/ui/Segmented'
import { Select } from '@/components/ui/Select'
import { Stepper } from '@/components/ui/Stepper'
import { Textarea } from '@/components/ui/Textarea'
import { getApiErrorMessage } from '@/lib/apiError'
import { TRANSACTION_TYPES, type TransactionWithNames } from '@/types/transaction'
import { newIdempotencyKey } from '@/utils/idempotencyKey'
import { transactionTypeLabels } from '@/utils/labels'
import { selectablePartners } from '@/utils/partners'

const schema = z.object({
  type: z.enum(['sale', 'purchase', 'repair', 'exchange']),
  scissor_type: z.string().min(1, 'نوع قیچی را وارد کنید'),
  partner_id: z.string().min(1, 'شریک را انتخاب کنید'),
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  amount: z.number().positive('مبلغ باید بزرگتر از صفر باشد'),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function TransactionForm({
  transaction,
  onDone,
}: {
  transaction?: TransactionWithNames
  onDone: () => void
}) {
  const partners = usePartners()
  const createTx = useCreateTransaction()
  const updateTx = useUpdateTransaction()

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'sale',
      scissor_type: '',
      partner_id: '',
      customer_id: '',
      customer_name: '',
      amount: 0,
      quantity: 1,
      note: '',
    },
  })

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        scissor_type: transaction.scissor_type,
        partner_id: String(transaction.partner_id),
        customer_id: transaction.customer_id ? String(transaction.customer_id) : '',
        customer_name: transaction.customer_name ?? '',
        amount: Number(transaction.amount),
        quantity: transaction.quantity,
        note: transaction.note ?? '',
      })
    }
  }, [transaction, reset])

  const mutation = transaction ? updateTx : createTx
  const quantity = watch('quantity')

  const onSubmit = handleSubmit((values) => {
    const payload = {
      type: values.type,
      scissor_type: values.scissor_type,
      partner_id: Number(values.partner_id),
      customer_id: values.customer_id ? Number(values.customer_id) : undefined,
      amount: values.amount,
      quantity: values.quantity,
      note: values.note || undefined,
    } as const

    if (transaction) {
      updateTx.mutate({ id: transaction.id, data: payload }, { onSuccess: onDone })
    } else {
      createTx.mutate({ data: payload, idempotencyKey: newIdempotencyKey() }, { onSuccess: onDone })
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>نوع تراکنش</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Segmented
              value={field.value}
              onChange={field.onChange}
              options={TRANSACTION_TYPES.map((t) => ({ value: t, label: transactionTypeLabels[t] }))}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scissor_type">نوع قیچی</Label>
        <Input id="scissor_type" {...register('scissor_type')} error={errors.scissor_type?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>مربوط به کدام شریک</Label>
        <Controller
          control={control}
          name="partner_id"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب شریک"
              error={errors.partner_id?.message}
              options={selectablePartners(partners.data ?? [], field.value).map((p) => ({ value: String(p.id), label: p.name }))}
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
            <CustomerCombobox
              value={field.value}
              displayName={watch('customer_name')}
              onChange={(id, name) => {
                field.onChange(id ?? '')
                setValue('customer_name', name ?? '')
              }}
              placeholder="نام مشتری را تایپ کنید"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">مبلغ</Label>
        <AmountInput id="amount" {...register('amount', { valueAsNumber: true })} error={errors.amount?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>تعداد</Label>
        <Stepper value={quantity} onChange={(v) => setValue('quantity', v, { shouldValidate: true })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">یادداشت (اختیاری)</Label>
        <Textarea id="note" {...register('note')} />
      </div>

      {mutation.isError && <ErrorBanner message={getApiErrorMessage(mutation.error)} />}

      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? 'در حال ذخیره...' : transaction ? 'ذخیرهٔ تغییرات' : 'ثبت تراکنش'}
      </Button>
    </form>
  )
}
