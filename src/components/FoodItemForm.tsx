"use client";

import { addFoodItem } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";

export function FoodItemForm({ entryId }: { entryId: string }) {
  return (
    <form action={addFoodItem} className="space-y-4 rounded-3xl bg-white p-5 shadow-card">
      <input type="hidden" name="entryId" value={entryId} />
      <h3 className="font-display text-2xl">Add a food item</h3>
      <input name="name" required placeholder="Burger, fries, coke…" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
      <input name="cost" type="number" min="0" step="1" placeholder="Cost in ₹" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" />
      <RatingField name="sreeRating" label="Sree’s rating out of 10" colorClass="text-sree" />
      <textarea name="sreeReview" placeholder="Sree’s review" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={2} />
      <RatingField name="dhanushRating" label="Dhanush’s rating out of 10" colorClass="text-dhanush" />
      <textarea name="dhanushReview" placeholder="Dhanush’s review" className="w-full rounded-2xl bg-cream px-4 py-3 outline-none" rows={2} />
      <WorthItPicker />
      <button className="rounded-full bg-ink px-5 py-2 text-white">Add item</button>
    </form>
  );
}
