import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { EntryCard } from "@/components/EntryCard";
import Link from "next/link";
import { formatRupees, todayKey } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  const counts = await prisma.entry.groupBy({
    by: ["category"],
    _count: true,
  });
  const recent = await prisma.entry.findMany({
    orderBy: [{ dateKey: "desc" }, { createdAt: "desc" }],
    take: 8,
  });
  const countByCategory = Object.fromEntries(counts.map((item) => [item.category, item._count]));
  const movies = countByCategory.MOVIE ?? 0;
  const foods = countByCategory.FOOD ?? 0;
  const places = countByCategory.PLACE ?? 0;
  const others = countByCategory.OTHER ?? 0;
  const total = movies + foods + places + others;
  const greetings = [
    `Welcome back, ${user.displayName} 💗`,
    `Ready to keep a memory, ${user.displayName}?`,
    `Your little world missed you, ${user.displayName}.`,
  ];
  const hello = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="rounded-3xl bg-white/70 p-8 shadow-card">
          <p className="text-sm text-muted">Logged in as {user.displayName}</p>
          <h1 className="mt-2 font-display text-5xl">{hello}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Add Movie", "/add?category=MOVIE", "🎬"],
              ["Add Food", "/add?category=FOOD", "🍔"],
              ["Add Place", "/add?category=PLACE", "📍"],
              ["Add Experience", "/add?category=OTHER", "✨"],
            ].map(([label, href, emoji]) => (
              <Link key={href} href={href} className="rounded-3xl bg-cream px-4 py-5 text-center shadow-card">
                <div className="text-2xl">{emoji}</div>
                <div className="mt-2 font-medium">{label}</div>
              </Link>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Movies watched", movies],
            ["Food rated", foods],
            ["Places visited", places],
            ["Total memories", total],
          ].map(([label, value]) => (
            <article key={String(label)} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-sm text-muted">{label}</p>
              <p className="font-display text-4xl">{value}</p>
            </article>
          ))}
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl">Recent memories</h2>
            <Link href={`/day/${todayKey()}`} className="text-sm text-sree">
              Today’s page
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-muted shadow-card">
              Nothing saved yet. Your first memory will live here forever.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((entry) => (
                <EntryCard key={entry.id} {...entry} />
              ))}
            </div>
          )}
        </section>
        <p className="text-center text-sm text-muted">
          Shared journal · both of you can see every rating · costs in {formatRupees(0).replace("0", "")}
        </p>
      </main>
    </>
  );
}
