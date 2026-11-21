import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomersOpenBalance } from "@/api/reports/queries";
import { useCustomers } from "@/api/customers/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ListRow } from "@/components/ui/ListRow";
import { Sheet } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { getApiErrorMessage } from "@/lib/apiError";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { toPersianDigits } from "@/utils/persianDigits";
import { CustomerForm } from "./CustomerForm";

export function CustomersPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === "admin");
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const customers = useCustomers(q || undefined);
  const openBalances = useCustomersOpenBalance();

  const balanceByCustomer = useMemo(() => {
    const map = new Map<number, number>();
    for (const row of openBalances.data ?? []) {
      map.set(row.customer_id, (map.get(row.customer_id) ?? 0) + Number(row.remaining_balance));
    }
    return map;
  }, [openBalances.data]);

  return (
    <div>
      <Topbar title="مشتریان" />
      <Content>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 rounded-[11px] border border-border bg-surface px-3.5 py-2.5">
            <Search className="pointer-events-none absolute end-3.5 top-1/2 size-[15px] -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجوی نام یا شمارهٔ تماس"
              className="w-full bg-transparent pe-6 text-[12.5px] outline-none"
            />
          </div>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> مشتری جدید
            </Button>
          )}
        </div>

        {customers.isLoading && <Spinner />}
        {customers.isError && <ErrorBanner message={getApiErrorMessage(customers.error)} />}
        {customers.data && (
          <Card>
            {customers.data.map((c) => {
              const balance = balanceByCustomer.get(c.id);
              return (
                <ListRow
                  key={c.id}
                  onClick={() => navigate(paths.customerDetail(c.id))}
                  avatar={<Avatar name={c.name} tone={balance ? "danger" : "edit"} />}
                  title={c.name}
                  subtitle={c.phone ? toPersianDigits(c.phone) : undefined}
                  chevron
                  side={
                    balance ? (
                      <Chip tone="balance">
                        {toPersianDigits(balance.toLocaleString("en-US"))}ت
                      </Chip>
                    ) : undefined
                  }
                />
              );
            })}
            {customers.data.length === 0 && (
              <p className="p-8 text-center text-xs text-muted">مشتری‌ای یافت نشد</p>
            )}
          </Card>
        )}
      </Content>

      <Sheet open={createOpen} onOpenChange={setCreateOpen} title="مشتری جدید">
        <CustomerForm onDone={() => setCreateOpen(false)} />
      </Sheet>
    </div>
  );
}
