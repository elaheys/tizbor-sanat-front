import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePartners } from "@/api/partners/queries";
import { useCreateLoan } from "@/api/partnerLedger/queries";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import { newIdempotencyKey } from "@/utils/idempotencyKey";
import { selectablePartners } from "@/utils/partners";

const schema = z
  .object({
    from_partner_id: z.string().min(1, "لازم است"),
    to_partner_id: z.string().min(1, "لازم است"),
    amount: z.number().positive("مبلغ باید بزرگتر از صفر باشد"),
    note: z.string().optional(),
  })
  .refine((v) => v.from_partner_id !== v.to_partner_id, {
    message: "دو طرف قرض نمی‌توانند یکسان باشند",
    path: ["to_partner_id"],
  });

type FormValues = z.infer<typeof schema>;

export function LoanForm({ onDone }: { onDone: () => void }) {
  const partners = usePartners();
  const createLoan = useCreateLoan();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { from_partner_id: "", to_partner_id: "", amount: 0, note: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createLoan.mutate(
      {
        data: {
          from_partner_id: Number(values.from_partner_id),
          to_partner_id: Number(values.to_partner_id),
          amount: values.amount,
          note: values.note || undefined,
        },
        idempotencyKey: newIdempotencyKey(),
      },
      { onSuccess: onDone },
    );
  });

  const options = selectablePartners(partners.data ?? []).map((p) => ({
    value: String(p.id),
    label: p.name,
  }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>قرض‌دهنده</Label>
        <Controller
          control={control}
          name="from_partner_id"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب شریک"
              options={options}
              error={errors.from_partner_id?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>قرض‌گیرنده</Label>
        <Controller
          control={control}
          name="to_partner_id"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب شریک"
              options={options}
              error={errors.to_partner_id?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">مبلغ</Label>
        <AmountInput
          id="amount"
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">یادداشت (اختیاری)</Label>
        <Textarea id="note" {...register("note")} />
      </div>

      {createLoan.isError && <ErrorBanner message={getApiErrorMessage(createLoan.error)} />}

      <Button type="submit" disabled={createLoan.isPending} className="mt-2">
        {createLoan.isPending ? "در حال ذخیره..." : "ثبت قرض"}
      </Button>
    </form>
  );
}
