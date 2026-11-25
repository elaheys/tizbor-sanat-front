import dayjs from "@/lib/dayjs";
import { jalaliMonthName } from "@/utils/jalali";
import { toPersianDigits } from "@/utils/persianDigits";
import { Select } from "./Select";

/** First Jalali year the app needs — no older data exists. */
const BASE_JALALI_YEAR = 1405;

/** Three Selects (day/month/year) for a Jalali date. `value`/`onChange` stay Gregorian "YYYY-MM-DD". */
export function JalaliDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const jalali = dayjs(value).calendar("jalali");
  const year = jalali.year();
  const month = jalali.month() + 1;
  const day = jalali.date();

  const setJalali = (y: number, m: number, d: number) => {
    const daysInMonth = dayjs()
      .calendar("jalali")
      .year(y)
      .month(m - 1)
      .daysInMonth();
    const clampedDay = Math.min(d, daysInMonth);
    const next = dayjs()
      .calendar("jalali")
      .year(y)
      .month(m - 1)
      .date(clampedDay);
    onChange(next.calendar("gregory").format("YYYY-MM-DD"));
  };

  const dayOptions = Array.from(
    {
      length: dayjs()
        .calendar("jalali")
        .year(year)
        .month(month - 1)
        .daysInMonth(),
    },
    (_, i) => ({ value: String(i + 1), label: toPersianDigits(i + 1) }),
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: jalaliMonthName(i + 1),
  }));
  const currentJalaliYear = dayjs().calendar("jalali").year();
  const lastJalaliYear = Math.max(BASE_JALALI_YEAR, currentJalaliYear);
  const yearOptions = Array.from(
    { length: lastJalaliYear - BASE_JALALI_YEAR + 1 },
    (_, i) => BASE_JALALI_YEAR + i,
  ).map((y) => ({ value: String(y), label: toPersianDigits(y) }));

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        value={String(day)}
        onChange={(v) => setJalali(year, month, Number(v))}
        options={dayOptions}
      />
      <Select
        value={String(month)}
        onChange={(v) => setJalali(year, Number(v), day)}
        options={monthOptions}
      />
      <Select
        value={String(year)}
        onChange={(v) => setJalali(Number(v), month, day)}
        options={yearOptions}
      />
    </div>
  );
}
