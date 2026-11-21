import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddCustomerPayment } from "@/api/customers/queries";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Label } from "@/components/ui/Label";
import { getApiErrorMessage } from "@/lib/apiError";
import { newIdempotencyKey } from "@/utils/idempotencyKey";

const schema = z.object({
  amount: z.number().positive("مبلغ باید بزرگتر از صفر باشد"),
});

type FormValues = z.infer<typeof schema>;

export function PaymentForm({ accountId, onDone }: { accountId: number; onDone: () => void }) {
  const addPayment = useAddCustomerPayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { amount: 0 } });

  const onSubmit = handleSubmit((values) => {
    addPayment.mutate(
      { accountId, data: { amount: values.amount }, idempotencyKey: newIdempotencyKey() },
      { onSuccess: onDone },
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">مبلغ پرداختی</Label>
        <AmountInput
          id="amount"
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
        />
      </div>

      {addPayment.isError && <ErrorBanner message={getApiErrorMessage(addPayment.error)} />}

      <Button type="submit" disabled={addPayment.isPending} className="mt-2">
        {addPayment.isPending ? "در حال ذخیره..." : "ثبت پرداخت"}
      </Button>
    </form>
  );
}
