"use client";

import { updateEntry, toggleFavorite } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { isSree } from "@/lib/constants";

type Entry = {
  id: string;
  title: string;
  dateKey: string;
  cost: number;
  worthIt?: string | null;
  notes: string;
  restaurant?: string | null;
  location?: string | null;
  description?: string | null;
  sreeRating?: number | null;
  sreeReview: string;
  dhanushRating?: number | null;
  dhanushReview: string;
  favoriteSree: boolean;
  favoriteDhanush: boolean;
};

export function EntryEditor({ entry, username }: { entry: Entry; username: string }) {
  const mine = isSree(username);
  const fav = mine ? entry.favoriteSree : entry.favoriteDhanush;
  return (
    <div className="space-y-4">
      <form action={toggleFavorite.bind(null, entry.id)}>
        <button className="rounded-full bg-white px-4 py-2 shadow-card">
          {fav ? "❤️ Favorited" : "♡ Mark favorite"}
        </button>
      </form>
      <form action={updateEntry} className="space-y-4 rounded-3xl bg-white p-5 shadow-card">
        <input type="hidden" name="id" value={entry.id} />
        <h3 className="font-display text-2xl">Update your notes</h3>
        <input name="title" defaultValue={entry.title} className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
        <input name="dateKey" type="date" defaultValue={entry.dateKey} className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
        <input name="cost" type="number" defaultValue={entry.cost} className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
        {entry.restaurant !== undefined && (
          <input name="restaurant" defaultValue={entry.restaurant ?? ""} placeholder="Restaurant" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
        )}
        {entry.location !== undefined && (
          <input name="location" defaultValue={entry.location ?? ""} placeholder="Location" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
        )}
        <textarea name="description" defaultValue={entry.description ?? ""} placeholder="Description" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={2} />
        {mine ? (
          <>
            <RatingField name="sreeRating" label="Sree’s rating" defaultValue={entry.sreeRating} colorClass="text-sree" />
            <textarea name="sreeReview" defaultValue={entry.sreeReview} className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={3} />
          </>
        ) : (
          <>
            <RatingField name="dhanushRating" label="Dhanush’s rating" defaultValue={entry.dhanushRating} colorClass="text-dhanush" />
            <textarea name="dhanushReview" defaultValue={entry.dhanushReview} className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={3} />
          </>
        )}
        <WorthItPicker defaultValue={entry.worthIt} />
        <textarea name="notes" defaultValue={entry.notes} placeholder="Highlight / notes" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={3} />
        <button className="rounded-full bg-ink px-5 py-2 text-white">Save changes</button>
      </form>
    </div>
  );
}
