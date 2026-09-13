import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import Link from "next/link";
import { monthRange, todayKey } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  await requireUser();
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year || now.getFullYear());
  const month = Number(params.month || now.getMonth() + 1);
  const { start, end } = monthRange(year, month);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = new Date(year, month - 1, 1).getDay();
  const entries = await prisma.entry.findMany({
    where: { dateKey: { gte: start, lte: end } },
    select: { dateKey: true, category: true },
  });
  const days = await prisma.dayMemory.findMany({
    where: { dateKey: { gte: start, lte: end } },
    select: { dateKey: true },
  });
  const marked = new Set([...entries.map((e) => e.dateKey), ...days.map((d) => d.dateKey)]);
  const prev = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  const label = new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <Link href={`/timeline?year=${prev.year}&month=${prev.month}`}>←</Link>
          <h1 className="font-display text-4xl">{label}</h1>
          <Link href={`/timeline?year=${next.year}&month=${next.month}`}>→</Link>
        </div>
        <p className="text-sm text-muted">Pick a date to open that day’s movie, food, places, and highlight.</p>
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-muted">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const has = marked.has(key);
            const isToday = key === todayKey();
            return (
              <Link
                key={key}
                href={`/day/${key}`}
                className={`rounded-2xl py-3 ${has ? "bg-sree text-white" : "bg-white"} ${isToday ? "ring-2 ring-dhanush" : ""}`}
              >
                {day}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
