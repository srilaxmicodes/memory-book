"use client";

import { updateEntry, toggleFavorite } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";

type Entry = {
  id: string;
  category: string;
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

export function EntryEditor({ entry }: { entry: Entry }) {
  const fav = entry.favoriteSree || entry.favoriteDhanush;
  const showRestaurant = entry.category === "FOOD";
  const showLocation = entry.category === "FOOD" || entry.category === "PLACE";
  const descriptionPlaceholder =
    entry.category === "FOOD" ? "Describe the food or outing" : entry.category === "PLACE" ? "Describe the place" : "Description";

  return (
    <div className="space-y-4">
      <form action={toggleFavorite.bind(null, entry.id)}>
        <button className="rounded-full bg-white px-4 py-2 shadow-card">
          {fav ? "❤️ Our favorite" : "♡ Mark our favorite"}
        </button>
      </form>
      <form action={updateEntry} className="space-y-4 rounded-3xl bg-white/80 p-5 shadow-card">
        <input type="hidden" name="id" value={entry.id} />
        <h3 className="font-display text-2xl">View / edit this memory</h3>
        <input name="title" placeholder="Title" defaultValue={entry.title} className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
        <input name="dateKey" type="date" defaultValue={entry.dateKey} className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
        <input name="cost" type="number" placeholder="Cost" defaultValue={entry.cost} className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
        {showRestaurant && (
          <input name="restaurant" defaultValue={entry.restaurant ?? ""} placeholder="Restaurant" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
        )}
        {showLocation && (
          <input name="location" defaultValue={entry.location ?? ""} placeholder="Location" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
        )}
        <textarea name="description" defaultValue={entry.description ?? ""} placeholder={descriptionPlaceholder} className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        <RatingField name="sreeRating" label="Sree’s rating out of 10" defaultValue={entry.sreeRating} colorClass="text-sree" />
        <textarea name="sreeReview" defaultValue={entry.sreeReview} placeholder="Sree’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        <RatingField name="dhanushRating" label="Dhanush’s rating out of 10" defaultValue={entry.dhanushRating} colorClass="text-dhanush" />
        <textarea name="dhanushReview" defaultValue={entry.dhanushReview} placeholder="Dhanush’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-rose/50 bg-white/70 px-4 py-8 text-center shadow-card">
          <input type="file" name="files" accept="image/*,video/*" multiple className="sr-only" />
          <span className="text-2xl">📷🎥</span>
          <span className="mt-2 font-medium">Upload more photos & videos</span>
          <span className="mt-1 text-sm text-muted">They will be saved when you save changes.</span>
        </label>
        <WorthItPicker defaultValue={entry.worthIt} />
        <textarea name="notes" defaultValue={entry.notes} placeholder="Highlight / extra notes" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        <button className="rounded-full bg-ink px-5 py-2 text-white">Save changes</button>
      </form>
    </div>
  );
}
