import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { EntryCard } from "@/components/EntryCard";
import { isSree } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await requireUser();
  const mine = isSree(user.username);
  const entries = await prisma.entry.findMany({
    where: mine ? { favoriteSree: true } : { favoriteDhanush: true },
    orderBy: { dateKey: "desc" },
  });

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">{user.displayName}’s favorites ❤️</h1>
        {entries.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-muted shadow-card">
            Heart the memories you want to keep extra close.
          </p>
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
