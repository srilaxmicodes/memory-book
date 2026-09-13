import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { EntryCard } from "@/components/EntryCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q = "" } = await searchParams;
  const query = q.trim();
  const entries = query
    ? await prisma.entry.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { notes: { contains: query } },
            { sreeReview: { contains: query } },
            { dhanushReview: { contains: query } },
            { restaurant: { contains: query } },
            { location: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query.toUpperCase() } },
            { dateKey: { contains: query } },
            { foodItems: { some: { name: { contains: query } } } },
          ],
        },
        orderBy: { dateKey: "desc" },
      })
    : [];

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">Search</h1>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Movie, food, place, date, review…"
            className="flex-1 rounded-full bg-white px-5 py-3 shadow-card outline-none"
          />
          <button className="rounded-full bg-sree px-5 py-3 text-white">Search</button>
        </form>
        {query && entries.length === 0 && <p className="text-muted">No matching memories.</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} {...entry} />
          ))}
        </div>
      </main>
    </>
  );
}
