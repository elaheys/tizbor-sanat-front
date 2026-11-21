import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPartnerPassword } from "@/api/partners/queries";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getApiErrorMessage } from "@/lib/apiError";

const schema = z.object({
  new_password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm({
  partnerId,
  onDone,
}: {
  partnerId: number;
  onDone: () => void;
}) {
  const resetPassword = useResetPartnerPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { new_password: "" } });

  const onSubmit = handleSubmit((values) => {
    resetPassword.mutate(
      { id: partnerId, newPassword: values.new_password },
      { onSuccess: onDone },
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new_password">رمز عبور جدید</Label>
        <Input
          id="new_password"
          type="password"
          {...register("new_password")}
          error={errors.new_password?.message}
        />
      </div>

      {resetPassword.isError && <ErrorBanner message={getApiErrorMessage(resetPassword.error)} />}

      <Button type="submit" disabled={resetPassword.isPending} className="mt-2">
        {resetPassword.isPending ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
