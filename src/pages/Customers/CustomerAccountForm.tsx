import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCustomerAccount } from "@/api/customers/queries";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { getApiErrorMessage } from "@/lib/apiError";
import { newIdempotencyKey } from "@/utils/idempotencyKey";

const schema = z.object({
  total_amount: z.number().positive("مبلغ باید بزرگتر از صفر باشد"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CustomerAccountForm({
  customerId,
  onDone,
}: {
  customerId: number;
  onDone: () => void;
}) {
  const createAccount = useCreateCustomerAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { total_amount: 0, description: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createAccount.mutate(
      {
        data: {
          customer_id: customerId,
          total_amount: values.total_amount,
          description: values.description || undefined,
        },
        idempotencyKey: newIdempotencyKey(),
      },
      { onSuccess: onDone },
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="total_amount">مبلغ کل</Label>
        <AmountInput
          id="total_amount"
          {...register("total_amount", { valueAsNumber: true })}
          error={errors.total_amount?.message}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">توضیحات (اختیاری)</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      {createAccount.isError && <ErrorBanner message={getApiErrorMessage(createAccount.error)} />}

      <Button type="submit" disabled={createAccount.isPending} className="mt-2">
        {createAccount.isPending ? "در حال ذخیره..." : "باز کردن حساب قسطی"}
      </Button>
    </form>
  );
}
