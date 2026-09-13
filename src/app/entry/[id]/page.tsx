import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { EntryEditor } from "@/components/EntryEditor";
import { MediaGallery } from "@/components/MediaGallery";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categoryMeta, formatDate } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { media: true, foodItems: { include: { media: true } } },
  });
  if (!entry) notFound();
  const meta = categoryMeta(entry.category);

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link href="/memories" className="text-sm text-sree">
          ← Back to memories
        </Link>
        <div>
          <p className="text-sm text-muted">{meta.emoji} {meta.label} · {formatDate(entry.dateKey)}</p>
          <h1 className="font-display text-5xl">{entry.title}</h1>
        </div>
        {(entry.backdropUrl || entry.posterUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.backdropUrl || entry.posterUrl || ""}
            alt=""
            className="max-h-[420px] w-full rounded-3xl object-cover shadow-soft"
          />
        )}
        <EntryEditor entry={entry} />
        <section className="space-y-3">
          <h2 className="font-display text-3xl">Photos & videos</h2>
          <MediaGallery media={entry.media} />
        </section>
        <Link href={`/day/${entry.dateKey}`} className="inline-block text-sree">
          See everything from {formatDate(entry.dateKey)} →
        </Link>
      </main>
    </>
  );
}
