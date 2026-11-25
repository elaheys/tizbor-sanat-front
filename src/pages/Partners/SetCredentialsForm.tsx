import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSetPartnerCredentials } from "@/api/partners/queries";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getApiErrorMessage } from "@/lib/apiError";

const schema = z.object({
  username: z.string().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

type FormValues = z.infer<typeof schema>;

export function SetCredentialsForm({
  partnerId,
  onDone,
}: {
  partnerId: number;
  onDone: () => void;
}) {
  const setCredentials = useSetPartnerCredentials();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setCredentials.mutate({ id: partnerId, data: values }, { onSuccess: onDone });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">نام کاربری</Label>
        <Input id="username" dir="ltr" {...register("username")} error={errors.username?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      {setCredentials.isError && <ErrorBanner message={getApiErrorMessage(setCredentials.error)} />}

      <Button type="submit" disabled={setCredentials.isPending} className="mt-2">
        {setCredentials.isPending ? "در حال ذخیره..." : "ثبت نام کاربری و رمز عبور"}
      </Button>
    </form>
  );
}
