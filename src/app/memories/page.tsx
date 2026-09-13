import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { EntryCard } from "@/components/EntryCard";
import { requireUser } from "@/lib/session";
import { CATEGORIES, monthRange } from "@/lib/constants";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; range?: string; from?: string; to?: string }>;
}) {
  await requireUser();
  const params = await searchParams;
  const now = new Date();
  let dateFilter: { gte?: string; lte?: string } = {};
  if (params.range === "month") {
    const { start, end } = monthRange(now.getFullYear(), now.getMonth() + 1);
    dateFilter = { gte: start, lte: end };
  } else if (params.range === "year") {
    dateFilter = { gte: `${now.getFullYear()}-01-01`, lte: `${now.getFullYear()}-12-31` };
  } else if (params.from || params.to) {
    dateFilter = { gte: params.from, lte: params.to };
  }

  const entries = await prisma.entry.findMany({
    where: {
      category: params.category || undefined,
      dateKey: Object.keys(dateFilter).length ? dateFilter : undefined,
    },
    orderBy: [{ dateKey: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">Memories</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/memories" className="rounded-full bg-white px-4 py-2 shadow-card">
            All
          </Link>
          {CATEGORIES.map((item) => (
            <Link
              key={item.value}
              href={`/memories?category=${item.value}`}
              className="rounded-full bg-white px-4 py-2 shadow-card"
            >
              {item.emoji} {item.label}
            </Link>
          ))}
          <Link href="/memories?range=month" className="rounded-full bg-white px-4 py-2 shadow-card">
            This month
          </Link>
          <Link href="/memories?range=year" className="rounded-full bg-white px-4 py-2 shadow-card">
            This year
          </Link>
        </div>
        <form className="flex flex-wrap gap-2">
          <input type="date" name="from" defaultValue={params.from} className="rounded-full bg-white px-3 py-2 shadow-card" />
          <input type="date" name="to" defaultValue={params.to} className="rounded-full bg-white px-3 py-2 shadow-card" />
          <button className="rounded-full bg-ink px-4 py-2 text-white">Custom range</button>
        </form>
        {entries.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-muted shadow-card">No memories in this view yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} {...entry} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
