import Link from "next/link";
import { averageRating, categoryMeta, formatDate, formatRupees } from "@/lib/constants";
import { DualReviews } from "./DualReviews";

type EntryCardProps = {
  id: string;
  title: string;
  category: string;
  dateKey: string;
  posterUrl?: string | null;
  sreeRating?: number | null;
  dhanushRating?: number | null;
  sreeReview?: string | null;
  dhanushReview?: string | null;
  cost?: number;
  notes?: string | null;
};

export function EntryCard(entry: EntryCardProps) {
  const meta = categoryMeta(entry.category);
  const avg = averageRating(entry.sreeRating, entry.dhanushRating);
  const snippet = (entry.sreeReview || entry.dhanushReview || entry.notes || "").slice(0, 90);

  return (
    <Link href={`/entry/${entry.id}`} className="card-hover block overflow-hidden rounded-3xl bg-white shadow-card">
      {entry.posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={entry.posterUrl} alt="" className="h-44 w-full object-cover" />
      )}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {meta.emoji} {meta.label}
          </span>
          <span>{formatDate(entry.dateKey)}</span>
        </div>
        <h3 className="font-display text-2xl">{entry.title}</h3>
        <p className="text-sm text-muted">
          ❤️ {entry.sreeRating ?? "—"} · 💙 {entry.dhanushRating ?? "—"}
          {avg ? ` · avg ${avg}` : ""}
          {entry.cost ? ` · ${formatRupees(entry.cost)}` : ""}
        </p>
        {snippet && <p className="text-sm text-ink/80">{snippet}</p>}
      </div>
    </Link>
  );
}

export { DualReviews };
