import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePartners } from "@/api/partners/queries";
import { useCreateTransaction, useUpdateTransaction } from "@/api/transactions/queries";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/Button";
import { CustomerCombobox } from "@/components/ui/CustomerCombobox";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { JalaliDatePicker } from "@/components/ui/JalaliDatePicker";
import { Label } from "@/components/ui/Label";
import { Segmented } from "@/components/ui/Segmented";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import dayjs from "@/lib/dayjs";
import { TRANSACTION_TYPES, type TransactionWithNames } from "@/types/transaction";
import { newIdempotencyKey } from "@/utils/idempotencyKey";
import { transactionTypeLabels } from "@/utils/labels";
import { selectablePartners } from "@/utils/partners";
import { formatToman } from "@/utils/persianDigits";

const schema = z.object({
  type: z.enum(["sale", "purchase", "repair", "exchange"]),
  scissor_type: z.string().min(1, "نوع قیچی را وارد کنید"),
  partner_id: z.string().min(1, "شریک را انتخاب کنید"),
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  unit_price: z.number().positive("قیمت واحد باید بزرگتر از صفر باشد"),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  entry_date: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm({
  transaction,
  onDone,
}: {
  transaction?: TransactionWithNames;
  onDone: () => void;
}) {
  const partners = usePartners();
  const createTx = useCreateTransaction();
  const updateTx = useUpdateTransaction();

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
      type: "sale",
      scissor_type: "",
      partner_id: "",
      customer_id: "",
      customer_name: "",
      unit_price: 0,
      quantity: 1,
      note: "",
      entry_date: dayjs().format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (transaction) {
      // The stored `amount` is already the transaction's total (older rows were entered
      // directly as a total, before quantity started multiplying it) — divide back out
      // to get a per-unit price that reproduces the same total when multiplied by qty.
      reset({
        type: transaction.type,
        scissor_type: transaction.scissor_type,
        partner_id: String(transaction.partner_id),
        customer_id: transaction.customer_id ? String(transaction.customer_id) : "",
        customer_name: transaction.customer_name ?? "",
        unit_price: Math.round(Number(transaction.amount) / transaction.quantity),
        quantity: transaction.quantity,
        note: transaction.note ?? "",
        entry_date: dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [transaction, reset]);

  const mutation = transaction ? updateTx : createTx;
  const quantity = watch("quantity");
  const unitPrice = watch("unit_price");
  const finalAmount = (unitPrice || 0) * (quantity || 0);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      type: values.type,
      scissor_type: values.scissor_type,
      partner_id: Number(values.partner_id),
      customer_id: values.customer_id ? Number(values.customer_id) : undefined,
      amount: values.unit_price * values.quantity,
      quantity: values.quantity,
      note: values.note || undefined,
    };

    if (transaction) {
      updateTx.mutate({ id: transaction.id, data: payload }, { onSuccess: onDone });
    } else {
      createTx.mutate(
        {
          data: { ...payload, created_at: values.entry_date },
          idempotencyKey: newIdempotencyKey(),
        },
        { onSuccess: onDone },
      );
    }
  });

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
              options={TRANSACTION_TYPES.map((t) => ({
                value: t,
                label: transactionTypeLabels[t],
              }))}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scissor_type">نوع قیچی</Label>
        <Input
          id="scissor_type"
          {...register("scissor_type")}
          error={errors.scissor_type?.message}
        />
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
              options={selectablePartners(partners.data ?? [], field.value).map((p) => ({
                value: String(p.id),
                label: p.name,
              }))}
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
              displayName={watch("customer_name")}
              onChange={(id, name) => {
                field.onChange(id ?? "");
                setValue("customer_name", name ?? "");
              }}
              placeholder="نام مشتری را تایپ کنید"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unit_price">قیمت واحد</Label>
        <AmountInput
          id="unit_price"
          {...register("unit_price", { valueAsNumber: true })}
          error={errors.unit_price?.message}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>تعداد</Label>
        <Stepper
          value={quantity}
          onChange={(v) => setValue("quantity", v, { shouldValidate: true })}
        />
      </div>

      <div className="flex items-center justify-between rounded-[10px] bg-surface-alt px-3 py-2.5 text-[13px]">
        <span className="text-muted">مبلغ نهایی</span>
        <span className="tabular-fa font-bold">{formatToman(finalAmount)} تومان</span>
      </div>

      {!transaction && (
        <div className="flex flex-col gap-1.5">
          <Label>تاریخ</Label>
          <Controller
            control={control}
            name="entry_date"
            render={({ field }) => (
              <JalaliDatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">یادداشت (اختیاری)</Label>
        <Textarea id="note" {...register("note")} />
      </div>

      {mutation.isError && <ErrorBanner message={getApiErrorMessage(mutation.error)} />}

      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? "در حال ذخیره..." : transaction ? "ذخیرهٔ تغییرات" : "ثبت تراکنش"}
      </Button>
    </form>
  );
}
