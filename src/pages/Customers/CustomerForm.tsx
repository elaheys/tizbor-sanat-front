import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCustomer, useUpdateCustomer } from "@/api/customers/queries";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getApiErrorMessage } from "@/lib/apiError";
import type { Customer } from "@/types/customer";

const schema = z.object({
  name: z.string().min(1, "نام را وارد کنید"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CustomerForm({ customer, onDone }: { customer?: Customer; onDone: () => void }) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (customer) reset({ name: customer.name, phone: customer.phone ?? "" });
  }, [customer, reset]);

  const mutation = customer ? updateCustomer : createCustomer;

  const onSubmit = handleSubmit((values) => {
    const payload = { name: values.name, phone: values.phone || undefined };
    if (customer) {
      updateCustomer.mutate({ id: customer.id, data: payload }, { onSuccess: onDone });
    } else {
      createCustomer.mutate(payload, { onSuccess: onDone });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">نام مشتری</Label>
        <Input id="name" {...register("name")} error={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">شماره تماس (اختیاری)</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      {mutation.isError && <ErrorBanner message={getApiErrorMessage(mutation.error)} />}

      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? "در حال ذخیره..." : customer ? "ذخیره تغییرات" : "افزودن مشتری"}
      </Button>
    </form>
  );
}
