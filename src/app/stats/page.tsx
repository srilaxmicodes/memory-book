import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { formatRupees, monthRange } from "@/lib/constants";

export const dynamic = "force-dynamic";

function avg(values: Array<number | null | undefined>) {
  const nums = values.filter((n): n is number => typeof n === "number");
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

export default async function StatsPage() {
  await requireUser();
  const now = new Date();
  const { start, end } = monthRange(now.getFullYear(), now.getMonth() + 1);
  const yearStart = `${now.getFullYear()}-01-01`;
  const yearEnd = `${now.getFullYear()}-12-31`;

  const entries = await prisma.entry.findMany({ include: { foodItems: true } });
  const movies = entries.filter((e) => e.category === "MOVIE");
  const foods = entries.filter((e) => e.category === "FOOD");
  const places = entries.filter((e) => e.category === "PLACE");
  const others = entries.filter((e) => e.category === "OTHER");
  const foodItems = foods.flatMap((e) => e.foodItems);

  function spend(list: typeof entries) {
    return list.reduce((sum, entry) => {
      if (entry.category === "FOOD" && entry.foodItems.length) {
        return sum + entry.foodItems.reduce((inner, item) => inner + item.cost, 0);
      }
      return sum + entry.cost;
    }, 0);
  }

  const monthEntries = entries.filter((e) => e.dateKey >= start && e.dateKey <= end);
  const yearEntries = entries.filter((e) => e.dateKey >= yearStart && e.dateKey <= yearEnd);
  const monthLabel = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const byCat = (list: typeof entries) => ({
    Movies: spend(list.filter((e) => e.category === "MOVIE")),
    Food: spend(list.filter((e) => e.category === "FOOD")),
    Places: spend(list.filter((e) => e.category === "PLACE")),
    Other: spend(list.filter((e) => e.category === "OTHER")),
  });
  const monthSpend = byCat(monthEntries);
  const monthTotal = Object.values(monthSpend).reduce((a, b) => a + b, 0);

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">Little stats 💗</h1>
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Movies watched</p>
            <p className="font-display text-4xl">{movies.length}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Average movie rating</p>
            <p className="font-display text-4xl">
              {avg(movies.flatMap((m) => [m.sreeRating, m.dhanushRating])) ?? "—"}
            </p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Food items rated</p>
            <p className="font-display text-4xl">{foodItems.length}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Places visited</p>
            <p className="font-display text-4xl">{places.length}</p>
          </article>
        </section>
        <section className="grid gap-3 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Sree’s average</p>
            <p className="font-display text-4xl text-sree">{avg(entries.map((e) => e.sreeRating)) ?? "—"}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Dhanush’s average</p>
            <p className="font-display text-4xl text-dhanush">{avg(entries.map((e) => e.dhanushRating)) ?? "—"}</p>
          </article>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-3xl">{monthLabel}</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(monthSpend).map(([label, amount]) => (
              <li key={label} className="flex justify-between">
                <span>{label}</span>
                <span>{formatRupees(amount)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-blush pt-2 font-medium">
              <span>Total</span>
              <span>{formatRupees(monthTotal)}</span>
            </li>
          </ul>
        </section>
        <section className="grid gap-3 md:grid-cols-3">
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Other experiences</p>
            <p className="font-display text-4xl">{others.length}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">Year spend</p>
            <p className="font-display text-4xl">{formatRupees(spend(yearEntries))}</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-sm text-muted">All-time spend</p>
            <p className="font-display text-4xl">{formatRupees(spend(entries))}</p>
          </article>
        </section>
      </main>
    </>
  );
}

