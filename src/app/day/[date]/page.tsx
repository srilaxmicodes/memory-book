import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { DayMemoryForm } from "@/components/DayMemoryForm";
import { MediaGallery } from "@/components/MediaGallery";
import { MediaUploader } from "@/components/MediaUploader";
import { DualReviews } from "@/components/DualReviews";
import Link from "next/link";
import { categoryMeta, formatDate, formatRupees } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DayPage({ params }: { params: Promise<{ date: string }> }) {
  await requireUser();
  const { date } = await params;
  const [entries, day] = await Promise.all([
    prisma.entry.findMany({
      where: { dateKey: date },
      include: { media: true, foodItems: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.dayMemory.findUnique({
      where: { dateKey: date },
      include: { media: true },
    }),
  ]);
  const total = entries.reduce((sum, entry) => {
    if (entry.category === "FOOD" && entry.foodItems.length) {
      return sum + entry.foodItems.reduce((inner, item) => inner + item.cost, 0);
    }
    return sum + entry.cost;
  }, 0);

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <h1 className="font-display text-5xl">{formatDate(date)}</h1>
        <p className="text-muted">Daily total: {formatRupees(total)}</p>
        {entries.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-muted shadow-card">No entries on this day yet.</p>
        )}
        {entries.map((entry) => {
          const meta = categoryMeta(entry.category);
          return (
            <article key={entry.id} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-sm text-muted">
                {meta.emoji} {meta.label}
              </p>
              <Link href={`/entry/${entry.id}`} className="font-display text-3xl">
                {entry.title}
              </Link>
              <p className="mt-1 text-sm">{formatRupees(entry.cost)}</p>
              <div className="mt-4">
                <DualReviews
                  sreeRating={entry.sreeRating}
                  sreeReview={entry.sreeReview}
                  dhanushRating={entry.dhanushRating}
                  dhanushReview={entry.dhanushReview}
                  worthIt={entry.worthIt}
                />
              </div>
              {entry.foodItems.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {entry.foodItems.map((item) => (
                    <li key={item.id}>
                      🍔 {item.name} — {formatRupees(item.cost)}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <MediaGallery media={entry.media} />
              </div>
            </article>
          );
        })}
        <DayMemoryForm
          dateKey={date}
          highlight={day?.highlight}
          mood={day?.mood}
          moodEmoji={day?.moodEmoji}
        />
        {day && (
          <p className="text-sm text-muted">
            Mood: {day.moodEmoji} {day.mood}
            {day.updatedBy ? ` · last edited by ${day.updatedBy}` : ""}
          </p>
        )}
        <section className="space-y-3">
          <h2 className="font-display text-3xl">Day gallery</h2>
          <MediaGallery media={day?.media ?? []} />
          <MediaUploader dateKey={date} />
        </section>
        <Link href={`/add?date=${date}`} className="inline-block rounded-full bg-sree px-5 py-2 text-white">
          Add something to this day
        </Link>
      </main>
    </>
  );
}
