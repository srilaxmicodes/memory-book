"use client";

import { addFoodItem } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { isSree } from "@/lib/constants";

export function FoodItemForm({ entryId, username }: { entryId: string; username: string }) {
  const mine = isSree(username);
  return (
    <form action={addFoodItem} className="space-y-4 rounded-3xl bg-white p-5 shadow-card">
      <input type="hidden" name="entryId" value={entryId} />
      <h3 className="font-display text-2xl">Add a food item</h3>
      <input name="name" required placeholder="Burger, fries, coke…" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
      <input name="cost" type="number" min="0" step="1" placeholder="Cost in ₹" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
      {mine ? (
        <>
          <RatingField name="sreeRating" label="Sree’s rating" colorClass="text-sree" />
          <textarea name="sreeReview" placeholder="Sree’s review" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={2} />
        </>
      ) : (
        <>
          <RatingField name="dhanushRating" label="Dhanush’s rating" colorClass="text-dhanush" />
          <textarea name="dhanushReview" placeholder="Dhanush’s review" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={2} />
        </>
      )}
      <WorthItPicker />
      <button className="rounded-full bg-ink px-5 py-2 text-white">Add item</button>
    </form>
  );
}
