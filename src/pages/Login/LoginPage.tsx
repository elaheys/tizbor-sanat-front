import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Scissors } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLogin } from "@/api/auth/queries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tooltip } from "@/components/ui/Tooltip";
import { getApiErrorMessage } from "@/lib/apiError";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [watch, setWatch] = useState<Boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? paths.dashboard;
    return <Navigate to={from} replace />;
  }

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate(paths.dashboard, { replace: true }),
    });
  });

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface p-5">
      <div className="shadow-card flex min-h-130 w-full max-w-235 overflow-hidden rounded-[28px] border border-border bg-surface">
        {/* visual pane */}
        <div
          className="relative hidden flex-1 flex-col justify-between overflow-hidden p-7.5 text-white md:flex"
          style={{
            background:
              "linear-gradient(150deg, var(--color-brand) 0%, var(--color-brand-dark) 65%, #102d26 100%)",
          }}
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            className="pointer-events-none absolute inset-e-[-10%] top-[-10%] w-[78%] opacity-15"
          >
            <circle cx="55" cy="140" r="16" />
            <circle cx="90" cy="110" r="16" />
            <path d="M66 128L175 30M100 122L175 170" />
          </svg>
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-white/18 text-sm font-bold">
              <Scissors className="size-4" />
            </div>
            <span className="text-[13.5px] font-bold">تیزبر صنعت</span>
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <h3 className="text-[20px] font-bold leading-relaxed text-balance">
              همکار همیشگی حساب‌وکتاب کارگاه شما
            </h3>
            <p className="max-w-[30ch] text-[12.5px] leading-7 text-brand-ink-tint">
              ثبت تراکنش، تسویهٔ شرکا، و گزارش سود ماهانه — همه در یک‌جا و همیشه در دسترس.
            </p>
          </div>
        </div>

        {/* form pane */}
        <div className="flex flex-1 flex-col justify-center p-6 md:p-9">
          <div className="flex flex-col gap-4.5">
            <div>
              <div className="text-[11px] font-bold text-accent-ink">ورود به حساب</div>
              <h2 className="mt-0.5 text-[21px] font-bold">خوش آمدید</h2>
              <p className="mt-1 text-[12.5px] leading-7 text-muted">
                برای ادامه، نام کاربری و رمز عبور خود را وارد کنید.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  {...register("username")}
                  error={errors.username?.message}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={watch ? "text" : "password"}
                    autoComplete="current-password"
                    className="pe-9"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                  <Tooltip label={watch ? "مخفی کردن رمز" : "نمایش رمز"}>
                    <button
                      type="button"
                      onClick={() => setWatch(!watch)}
                      className="absolute inset-e-3 top-2.75 cursor-pointer text-muted"
                      aria-label={watch ? "Hide password" : "Show password"}
                    >
                      {watch ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </Tooltip>
                </div>
              </div>

              {login.isError && (
                <div className="flex items-start gap-2 rounded-[10px] bg-danger-soft px-2.5 py-2.5">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
                  <div className="text-[11.5px] leading-7 text-danger">
                    {getApiErrorMessage(login.error, "نام کاربری یا رمز عبور اشتباه است.")}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={login.isPending}
                className="justify-center cursor-pointer"
              >
                {login.isPending ? "در حال ورود..." : "ورود"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
