import { Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDailyReport, useMonthlyReport } from "@/api/reports/queries";
import { usePartnerLedger } from "@/api/partnerLedger/queries";
import { useTransactions } from "@/api/transactions/queries";
import { Content, Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { LedgerCard } from "@/components/ui/LedgerCard";
import { Sheet } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { StatTile } from "@/components/ui/StatTile";
import { TxRow } from "@/components/ui/TxRow";
import { getApiErrorMessage } from "@/lib/apiError";
import dayjs from "@/lib/dayjs";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import { currentJalaliYearMonth, toJalaliLongDate } from "@/utils/jalali";
import { ledgerTypeLabels } from "@/utils/labels";
import { formatToman } from "@/utils/persianDigits";
import { LoanForm } from "../Ledger/LoanForm";
import { TransactionForm } from "../Transactions/TransactionForm";

export function DashboardPage() {
  const partner = useAuthStore((state) => state.partner);
  const [today] = useState(() => dayjs().format("YYYY-MM-DD"));
  const { year, month } = currentJalaliYearMonth();

  const [txSheetOpen, setTxSheetOpen] = useState(false);
  const [loanSheetOpen, setLoanSheetOpen] = useState(false);

  const daily = useDailyReport(today);
  const monthly = useMonthlyReport(year, month);
  const recentTx = useTransactions();
  const openLedger = usePartnerLedger({ is_settled: false });

  if (!partner) return null;

  const isAdmin = partner.role === "admin";
  const myShare = monthly.data?.partners.find((p) => p.partner_id === partner.id);
  const myLedger = openLedger.data?.filter(
    (e) => e.from_partner_id === partner.id || e.to_partner_id === partner.id,
  );

  return (
    <div>
      <Topbar
        title={`سلام، ${partner.name.split(" ")[0]} 👋`}
        description={toJalaliLongDate(today)}
        actions={<Chip tone="brand">{isAdmin ? "حسابدار" : "شریک"}</Chip>}
      />
      <Content>
        {daily.isLoading && <Spinner />}
        {daily.isError && <ErrorBanner message={getApiErrorMessage(daily.error)} />}
        {daily.data && (
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="فروش امروز" amount={daily.data.workshop_total.revenue} />
            <StatTile label="هزینهٔ امروز" amount={daily.data.workshop_total.expense} />
            <StatTile label="سود امروز" amount={daily.data.workshop_total.profit} primary />
          </div>
        )}

        {isAdmin && (
          <div className="flex flex-wrap gap-2.5">
            <Button onClick={() => setTxSheetOpen(true)}>
              <Plus className="size-4" /> ثبت تراکنش جدید
            </Button>
            <Button variant="secondary" onClick={() => setLoanSheetOpen(true)}>
              <Wallet className="size-4" /> ثبت قرض جدید
            </Button>
          </div>
        )}

        {!isAdmin && myShare && (
          <div>
            <h2 className="mb-2.5 text-[14.5px] font-bold">سهم من از سود این ماه</h2>
            <div className="flex flex-col gap-1 rounded-[14px] bg-brand p-4.5">
              <span className="text-xs text-brand-ink-tint">
                این ماه · سهم {myShare.share_percent}٪
              </span>
              <span className="tabular-fa text-[27px] font-extrabold text-white">
                {formatToman(myShare.profit_share)}{" "}
                <span className="text-[13px] font-semibold text-brand-ink-tint">تومان</span>
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[14.5px] font-bold">
                {isAdmin ? "تراکنش‌های اخیر" : "آخرین فعالیت کارگاه"}
              </h2>
              <Link to={paths.transactions} className="text-xs font-semibold text-brand-dark">
                مشاهدهٔ همه
              </Link>
            </div>
            <Card>
              {recentTx.isLoading && <Spinner className="m-4" />}
              {recentTx.data?.slice(0, 5).map((tx) => (
                <TxRow key={tx.id} tx={tx} />
              ))}
              {recentTx.data?.length === 0 && (
                <p className="p-6 text-center text-xs text-muted">تراکنشی ثبت نشده است</p>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[14.5px] font-bold">
                  {isAdmin ? "مانده‌های باز" : "مانده‌های باز من"}
                </h2>
                <Link to={paths.ledger} className="text-xs font-semibold text-brand-dark">
                  مشاهدهٔ همه
                </Link>
              </div>
              <Card>
                {(isAdmin ? openLedger.data : myLedger)?.slice(0, 2).map((e) => (
                  <LedgerCard
                    key={e.id}
                    fromName={e.from_partner_name}
                    toName={e.to_partner_name}
                    amount={e.amount}
                    chips={
                      <>
                        <Chip tone={e.type === "loan" ? "loan" : "settlement"}>
                          {ledgerTypeLabels[e.type]}
                        </Chip>
                        <Chip tone="pending">در انتظار</Chip>
                      </>
                    }
                    metaLeft={e.note}
                  />
                ))}
                {(isAdmin ? openLedger.data : myLedger)?.length === 0 && (
                  <p className="p-6 text-center text-xs text-muted">مانده‌ای باز نیست</p>
                )}
              </Card>
            </div>

            {isAdmin && monthly.data && (
              <Card className="flex flex-col gap-2 p-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-bold">گزارش ماه جاری</h2>
                  <Link to={paths.monthlyReport} className="text-xs font-semibold text-brand-dark">
                    مشاهده
                  </Link>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="tabular-fa text-xl font-extrabold">
                    {formatToman(monthly.data.profit)}
                  </span>
                  <span className="text-[11.5px] text-muted">تومان سود کل</span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Content>

      <Sheet open={txSheetOpen} onOpenChange={setTxSheetOpen} title="ثبت تراکنش جدید">
        <TransactionForm onDone={() => setTxSheetOpen(false)} />
      </Sheet>
      <Sheet open={loanSheetOpen} onOpenChange={setLoanSheetOpen} title="ثبت قرض جدید">
        <LoanForm onDone={() => setLoanSheetOpen(false)} />
      </Sheet>
    </div>
  );
}
