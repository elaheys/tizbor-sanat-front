import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { SetCredentialsForm } from "./SetCredentialsForm";

const schema = z.object({
  name: z.string().min(1, "نام را وارد کنید"),
  role: z.enum(["admin", "partner"]),
  share_percent: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof schema>;

export function PartnerForm({ partner, onDone }: { partner?: Partner; onDone: () => void }) {
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const [createdPartner, setCreatedPartner] = useState<Partner | null>(null);
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
    defaultValues: { name: "", role: "partner", share_percent: 0 },
  });

  const role = watch("role");

  useEffect(() => {
    if (partner)
      reset({
        name: partner.name,
        role: partner.role,
        share_percent: Number(partner.share_percent),
      });
  }, [partner, reset]);

  useEffect(() => {
    if (role === "admin") setValue("share_percent", 0);
  }, [role, setValue]);

  const mutation = partner ? updatePartner : createPartner;

  const onSubmit = handleSubmit((values) => {
    if (partner) {
      updatePartner.mutate({ id: partner.id, data: values }, { onSuccess: onDone });
    } else {
      createPartner.mutate(values, {
        onSuccess: (res) => setCreatedPartner(res.data),
      });
    }
  });

  // right after creating a new partner/admin record, ask for their login username +
  // password in the same sheet — without this step the account exists but can't log in
  if (createdPartner) {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-lg bg-accent-soft p-3 text-xs text-accent-ink">
          «{createdPartner.name}» ساخته شد. برای این‌که بتونه وارد بشه، یه نام کاربری و رمز عبور
          براش تعیین کن.
        </p>
        <SetCredentialsForm partnerId={createdPartner.id} onDone={onDone} />
        <button
          type="button"
          onClick={onDone}
          className="text-center text-[11.5px] font-semibold text-muted"
        >
          بعداً انجام می‌دهم
        </button>
      </div>
    );
  }

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
          disabled={role === "admin"}
          {...register("share_percent", { valueAsNumber: true })}
          error={errors.share_percent?.message}
        />
        {role === "admin" && <p className="text-[11px] text-muted">حسابدارها سهمی از سود ندارند</p>}
      </div>

      {mutation.isError && <ErrorBanner message={getApiErrorMessage(mutation.error)} />}

      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? "در حال ذخیره..." : partner ? "ذخیره تغییرات" : "افزودن شریک"}
      </Button>
    </form>
  );
}
