import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useChangePassword } from "@/api/auth/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  current_password: z.string().min(1, "رمز عبور فعلی را وارد کنید"),
  new_password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPage() {
  const partner = useAuthStore((state) => state.partner);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { current_password: "", new_password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(values, { onSuccess: () => reset() });
  });

  return (
    <div>
      <Topbar title="تنظیمات حساب" />
      <Content>
        <div className="max-w-[420px]">
          <h2 className="mb-2.5 text-[14.5px] font-bold">اطلاعات حساب</h2>
          <Card className="px-4 py-1">
            <div className="flex justify-between border-b border-border py-2.5 text-[12.5px] last:border-0">
              <span className="text-muted">نام</span>
              <b className="font-semibold">{partner?.name}</b>
            </div>
            <div className="flex justify-between border-b border-border py-2.5 text-[12.5px] last:border-0">
              <span className="text-muted">نام کاربری</span>
              <b className="font-semibold" dir="ltr">
                {partner?.username}
              </b>
            </div>
            <div className="flex justify-between py-2.5 text-[12.5px]">
              <span className="text-muted">نقش</span>
              <b className="font-semibold">{partner?.role === "admin" ? "حسابدار" : "شریک"}</b>
            </div>
          </Card>
        </div>

        <div className="max-w-[420px]">
          <h2 className="mb-2.5 text-[14.5px] font-bold">تغییر رمز عبور</h2>
          <Card className="flex flex-col gap-4 p-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="current_password">رمز عبور فعلی</Label>
                <Input
                  id="current_password"
                  type="password"
                  autoComplete="current-password"
                  {...register("current_password")}
                  error={errors.current_password?.message}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new_password">رمز عبور جدید</Label>
                <Input
                  id="new_password"
                  type="password"
                  autoComplete="new-password"
                  {...register("new_password")}
                  error={errors.new_password?.message}
                />
              </div>

              {changePassword.isError && (
                <ErrorBanner message={getApiErrorMessage(changePassword.error)} />
              )}
              {changePassword.isSuccess && (
                <p className="text-[11.5px] text-brand-dark">رمز عبور با موفقیت تغییر کرد</p>
              )}

              <Button type="submit" disabled={changePassword.isPending} className="justify-center">
                {changePassword.isPending ? "در حال ذخیره..." : "ذخیرهٔ رمز جدید"}
              </Button>
            </form>
          </Card>
        </div>
      </Content>
    </div>
  );
}
