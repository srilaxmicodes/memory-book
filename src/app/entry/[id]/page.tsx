import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { DualReviews } from "@/components/DualReviews";
import { MediaGallery } from "@/components/MediaGallery";
import { MediaUploader } from "@/components/MediaUploader";
import { EntryEditor } from "@/components/EntryEditor";
import { FoodItemForm } from "@/components/FoodItemForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { averageRating, categoryMeta, formatDate, formatRupees, worthItMeta } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { media: true, foodItems: { include: { media: true } } },
  });
  if (!entry) notFound();
  const meta = categoryMeta(entry.category);
  const avg = averageRating(entry.sreeRating, entry.dhanushRating);
  const worth = worthItMeta(entry.worthIt);
  const foodTotal = entry.foodItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <p className="text-sm text-muted">
          {meta.emoji} {meta.label} · saved by {entry.createdByName}
        </p>
        <h1 className="font-display text-5xl">{entry.title}</h1>
        {(entry.backdropUrl || entry.posterUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.backdropUrl || entry.posterUrl || ""}
            alt=""
            className="max-h-[420px] w-full rounded-3xl object-cover shadow-soft"
          />
        )}
        <div className="grid gap-3 rounded-3xl bg-white p-5 text-sm shadow-card md:grid-cols-2">
          <p>Watched / happened: {formatDate(entry.dateKey)}</p>
          {entry.releaseDate && <p>Release date: {entry.releaseDate}</p>}
          {entry.genres && <p>Genre: {entry.genres}</p>}
          {entry.imdbId && (
            <p>
              IMDb: {entry.imdbId}
              {entry.imdbRating ? ` · ${entry.imdbRating}` : ""}
            </p>
          )}
          {entry.restaurant && <p>Restaurant: {entry.restaurant}</p>}
          {entry.location && <p>Location: {entry.location}</p>}
          <p>Cost: {formatRupees(entry.category === "FOOD" && foodTotal ? foodTotal : entry.cost)}</p>
          {worth && (
            <p>
              Worth it: {worth.emoji} {worth.label}
            </p>
          )}
          {avg && <p>Average: {avg}/5</p>}
        </div>
        {entry.overview && <p className="text-muted">{entry.overview}</p>}
        {entry.description && <p>{entry.description}</p>}
        <DualReviews
          sreeRating={entry.sreeRating}
          sreeReview={entry.sreeReview}
          dhanushRating={entry.dhanushRating}
          dhanushReview={entry.dhanushReview}
          worthIt={entry.worthIt}
        />
        {entry.notes && (
          <section className="rounded-3xl bg-blush/50 p-5">
            <h2 className="font-display text-2xl">Highlight of the day</h2>
            <p className="mt-2">{entry.notes}</p>
          </section>
        )}
        {entry.category === "FOOD" && (
          <section className="space-y-4">
            <h2 className="font-display text-3xl">Food items</h2>
            <p className="text-sm text-muted">Total food cost: {formatRupees(foodTotal)}</p>
            {entry.foodItems.map((item) => (
              <article key={item.id} className="rounded-3xl bg-white p-5 shadow-card">
                <h3 className="text-xl font-medium">
                  {item.name} · {formatRupees(item.cost)}
                </h3>
                <DualReviews
                  sreeRating={item.sreeRating}
                  sreeReview={item.sreeReview}
                  dhanushRating={item.dhanushRating}
                  dhanushReview={item.dhanushReview}
                  worthIt={item.worthIt}
                />
                <div className="mt-3">
                  <MediaGallery media={item.media} />
                  <div className="mt-3">
                    <MediaUploader foodItemId={item.id} />
                  </div>
                </div>
              </article>
            ))}
            <FoodItemForm entryId={entry.id} username={user.username} />
          </section>
        )}
        <section className="space-y-3">
          <h2 className="font-display text-3xl">Photos & videos</h2>
          <MediaGallery media={entry.media} />
          <MediaUploader entryId={entry.id} />
        </section>
        <EntryEditor entry={entry} username={user.username} />
        <Link href={`/day/${entry.dateKey}`} className="inline-block text-sree">
          See everything from {formatDate(entry.dateKey)} →
        </Link>
      </main>
    </>
  );
}
