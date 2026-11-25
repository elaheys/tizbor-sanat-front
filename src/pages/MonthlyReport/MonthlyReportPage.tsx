import { useState } from "react";
import {
  useCustomersOpenBalance,
  useGenerateSettlements,
  useMonthlyReport,
  useTransactionsSummary,
} from "@/api/reports/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { LedgerCard } from "@/components/ui/LedgerCard";
import { ListRow } from "@/components/ui/ListRow";
import { Select } from "@/components/ui/Select";
import {
  LedgerCardSkeleton,
  ListRowSkeleton,
  SkeletonList,
  StatTileSkeleton,
} from "@/components/ui/skeletons";
import { StatTile } from "@/components/ui/StatTile";
import { getApiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";
import { currentJalaliYearMonth, jalaliMonthName } from "@/utils/jalali";
import { transactionTypeLabels } from "@/utils/labels";
import { formatToman, toPersianDigits } from "@/utils/persianDigits";

/** First Jalali year the app needs in the year picker — no older data exists. */
const BASE_JALALI_YEAR = 1405;

export function MonthlyReportPage() {
  const isAdmin = useAuthStore((state) => state.partner?.role === "admin");
  const todayJalali = currentJalaliYearMonth();
  const [year, setYear] = useState(todayJalali.year);
  const [month, setMonth] = useState(todayJalali.month);

  // year/month are Jalali — the server now bins everything by real Jalali month
  // boundaries, not Gregorian ones.
  const report = useMonthlyReport(year, month);
  const summary = useTransactionsSummary(year, month);
  const openBalances = useCustomersOpenBalance();
  const generateSettlements = useGenerateSettlements();

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
    value: String(m),
    label: jalaliMonthName(m),
  }));

  const lastJalaliYear = Math.max(BASE_JALALI_YEAR, todayJalali.year);
  const yearOptions = Array.from(
    { length: lastJalaliYear - BASE_JALALI_YEAR + 1 },
    (_, i) => BASE_JALALI_YEAR + i,
  ).map((jalaliYear) => ({
    value: String(jalaliYear),
    label: toPersianDigits(jalaliYear),
  }));

  return (
    <div>
      <Topbar
        title="گزارش ماهانه"
        actions={
          <div className="flex items-center gap-2">
            <div className="w-28">
              <Select
                value={String(month)}
                onChange={(v) => setMonth(Number(v))}
                options={monthOptions}
              />
            </div>
            <div className="w-24">
              <Select
                value={String(year)}
                onChange={(v) => setYear(Number(v))}
                options={yearOptions}
              />
            </div>
          </div>
        }
      />
      <Content>
        {report.isLoading && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatTileSkeleton />
              <StatTileSkeleton />
              <StatTileSkeleton />
            </div>
            <Card>
              <SkeletonList count={3} item={ListRowSkeleton} />
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <SkeletonList count={2} item={LedgerCardSkeleton} />
              </Card>
              <Card>
                <SkeletonList count={2} item={ListRowSkeleton} />
              </Card>
            </div>
          </>
        )}
        {report.isError && <ErrorBanner message={getApiErrorMessage(report.error)} />}

        {report.data && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="فروش کل ماه" amount={report.data.total_revenue} />
              <StatTile label="هزینهٔ کل ماه" amount={report.data.total_expense} />
              <StatTile label="سود خالص" amount={report.data.profit} primary />
            </div>

            <div>
              <h2 className="mb-2.5 text-[14.5px] font-bold">سهم هر شریک از سود</h2>
              <Card>
                {report.data.partners.map((p) => (
                  <ListRow
                    key={p.partner_id}
                    avatar={<Avatar name={p.partner_name} tone="edit" />}
                    title={p.partner_name}
                    subtitle={`سهم ${toPersianDigits(p.share_percent)}٪ از سود این ماه`}
                    side={
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="tabular-fa font-bold">{formatToman(p.profit_share)}ت</span>
                        {p.net_loan_balance !== 0 && (
                          <span
                            className={cn(
                              "tabular-fa text-[10.5px]",
                              p.net_loan_balance > 0 ? "text-brand-dark" : "text-danger",
                            )}
                          >
                            {p.net_loan_balance > 0 ? "طلب از قرض: " : "بدهی قرض: "}
                            {formatToman(Math.abs(p.net_loan_balance))}ت
                          </span>
                        )}
                      </div>
                    }
                  />
                ))}
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col gap-3">
                <h2 className="text-[14.5px] font-bold">انتقال‌های لازم برای تسویهٔ این ماه</h2>
                <Card>
                  {report.data.needed_transfers.map((t, i) => (
                    <LedgerCard
                      key={i}
                      fromName={t.from_partner_name ?? ""}
                      toName={t.to_partner_name ?? ""}
                      amount={t.amount}
                    />
                  ))}
                  {report.data.needed_transfers.length === 0 && (
                    <p className="p-8 text-center text-xs text-muted">انتقالی لازم نیست</p>
                  )}
                </Card>
                {isAdmin && (
                  <Button
                    disabled={
                      generateSettlements.isPending ||
                      report.data.needed_transfers.length === 0 ||
                      report.data.settlements_up_to_date
                    }
                    onClick={() => generateSettlements.mutate({ year, month })}
                    className="self-start"
                  >
                    {generateSettlements.isPending
                      ? "در حال ثبت..."
                      : "ثبت این تسویه‌ها در دفتر شرکا"}
                  </Button>
                )}
                {generateSettlements.isSuccess && (
                  <p className="text-xs text-brand-dark">
                    {generateSettlements.data.data.already_generated
                      ? "تسویه‌های این ماه قبلاً ثبت شده بودند."
                      : `${toPersianDigits(generateSettlements.data.data.settlements.length)} انتقال در دفتر شرکا ثبت شد.`}
                  </p>
                )}
                {generateSettlements.isError && (
                  <ErrorBanner message={getApiErrorMessage(generateSettlements.error)} />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-[14.5px] font-bold">مشتریان با ماندهٔ باز</h2>
                <Card>
                  {openBalances.data?.map((row) => (
                    <ListRow
                      key={row.account_id}
                      avatar={<Avatar name={row.customer_name} tone="danger" />}
                      title={row.customer_name}
                      subtitle={row.description ?? undefined}
                      side={<Chip tone="balance">{formatToman(row.remaining_balance)}ت</Chip>}
                    />
                  ))}
                  {openBalances.data?.length === 0 && (
                    <p className="p-8 text-center text-xs text-muted">مانده‌ای باز نیست</p>
                  )}
                </Card>
              </div>
            </div>

            <div>
              <h2 className="mb-2.5 text-[14.5px] font-bold">تفکیک تراکنش‌ها بر اساس نوع</h2>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {summary.data?.map((row) => (
                  <div
                    key={row.type}
                    className="flex flex-col gap-1 rounded-[8px] border border-border bg-surface-alt p-3"
                  >
                    <span className="text-[11px] text-muted">
                      {transactionTypeLabels[row.type as keyof typeof transactionTypeLabels] ??
                        row.type}
                    </span>
                    <span className="tabular-fa text-[14.5px] font-extrabold">
                      {formatToman(row.total)}ت
                    </span>
                    <span className="text-[10.5px] text-muted">
                      {toPersianDigits(row.count)} تراکنش
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Content>
    </div>
  );
}
