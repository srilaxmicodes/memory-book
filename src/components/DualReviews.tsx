import { worthItMeta } from "@/lib/constants";
import { StarRating } from "./StarRating";

export function DualReviews({
  sreeRating,
  sreeReview,
  dhanushRating,
  dhanushReview,
  worthIt,
}: {
  sreeRating?: number | null;
  sreeReview?: string | null;
  dhanushRating?: number | null;
  dhanushReview?: string | null;
  worthIt?: string | null;
}) {
  const worth = worthItMeta(worthIt);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-3xl bg-white p-5 shadow-card">
        <p className="font-medium text-sree">❤️ Sree</p>
        <div className="mt-2">
          <StarRating value={sreeRating} readOnly colorClass="text-sree" />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink">
          {sreeReview?.trim() ? `“${sreeReview}”` : "Waiting for Sree’s review."}
        </p>
      </article>
      <article className="rounded-3xl bg-white p-5 shadow-card">
        <p className="font-medium text-dhanush">💙 Dhanush</p>
        <div className="mt-2">
          <StarRating value={dhanushRating} readOnly colorClass="text-dhanush" />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink">
          {dhanushReview?.trim() ? `“${dhanushReview}”` : "Waiting for Dhanush’s review."}
        </p>
      </article>
      {worth && (
        <p className="md:col-span-2 rounded-3xl bg-blush/60 px-4 py-3 text-center">
          Worth it: {worth.emoji} {worth.label}
        </p>
      )}
    </div>
  );
}
