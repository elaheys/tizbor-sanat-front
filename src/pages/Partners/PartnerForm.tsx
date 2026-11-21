import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreatePartner, useUpdatePartner } from "@/api/partners/queries";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { getApiErrorMessage } from "@/lib/apiError";
import type { Partner } from "@/types/partner";

const schema = z.object({
  name: z.string().min(1, "نام را وارد کنید"),
  role: z.enum(["admin", "partner"]),
  share_percent: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof schema>;

export function PartnerForm({ partner, onDone }: { partner?: Partner; onDone: () => void }) {
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "partner", share_percent: 0 },
  });

  useEffect(() => {
    if (partner)
      reset({
        name: partner.name,
        role: partner.role,
        share_percent: Number(partner.share_percent),
      });
  }, [partner, reset]);

  const mutation = partner ? updatePartner : createPartner;

  const onSubmit = handleSubmit((values) => {
    if (partner) {
      updatePartner.mutate({ id: partner.id, data: values }, { onSuccess: onDone });
    } else {
      createPartner.mutate(values, { onSuccess: onDone });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">نام</Label>
        <Input id="name" {...register("name")} error={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>نقش</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "partner", label: "شریک" },
                { value: "admin", label: "حسابدار" },
              ]}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="share_percent">درصد سهم</Label>
        <Input
          id="share_percent"
          type="number"
          inputMode="numeric"
          {...register("share_percent", { valueAsNumber: true })}
          error={errors.share_percent?.message}
        />
      </div>

      {!partner && (
        <p className="rounded-lg bg-accent-soft p-3 text-xs text-accent-ink">
          این فرم فقط رکورد شریک را می‌سازد. برای تعیین نام کاربری و رمز عبور این شریک، باید روی
          سرور دستور زیر را اجرا کنید؛ در حال حاضر API راهی برای تنظیم نام کاربری ندارد:
          <br />
          <code dir="ltr">
            node scripts/set_password.js &lt;partner_id&gt; &lt;username&gt; &lt;password&gt;
          </code>
        </p>
      )}

      {mutation.isError && <ErrorBanner message={getApiErrorMessage(mutation.error)} />}

      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? "در حال ذخیره..." : partner ? "ذخیره تغییرات" : "افزودن شریک"}
      </Button>
    </form>
  );
}
