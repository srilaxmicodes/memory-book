"use client";

import { createEntry } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SimpleEntryForm({
  dateKey,
  category,
}: {
  dateKey: string;
  category: "FOOD" | "PLACE" | "OTHER";
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    formData.set("category", category);
    formData.set("dateKey", dateKey);
    const result = await createEntry(formData);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    if ("id" in result && result.id) router.push("/home");
  }

  return (
    <form action={submit} className="space-y-5">
      <input
        name="title"
        required
        placeholder={category === "FOOD" ? "Outing name (e.g. Dinner)" : category === "PLACE" ? "Place name" : "Title"}
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none"
      />
      {category === "FOOD" && (
        <input name="restaurant" placeholder="Restaurant" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
      )}
      {category === "PLACE" && (
        <input name="location" placeholder="Location (e.g. Hyderabad)" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
      )}
      <textarea
        name="description"
        placeholder={category === "FOOD" ? "Describe the food or outing" : category === "PLACE" ? "Describe the place" : "What happened?"}
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none"
        rows={3}
      />
      <input name="cost" type="number" min="0" step="1" placeholder="Cost in ₹" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
      <RatingField name="sreeRating" label="Sree’s rating out of 10" colorClass="text-sree" />
      <textarea name="sreeReview" placeholder="Sree’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      <RatingField name="dhanushRating" label="Dhanush’s rating out of 10" colorClass="text-dhanush" />
      <textarea name="dhanushReview" placeholder="Dhanush’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-rose/50 bg-white/70 px-4 py-8 text-center shadow-card">
        <input type="file" name="files" accept="image/*,video/*" multiple className="sr-only" />
        <span className="text-2xl">📷🎥</span>
        <span className="mt-2 font-medium">Upload photos & videos</span>
        <span className="mt-1 text-sm text-muted">They will be saved with this memory.</span>
      </label>
      <WorthItPicker />
      <textarea name="notes" placeholder="Highlight / extra notes" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      {error && <p className="text-sm text-sree">{error}</p>}
      <button className="w-full rounded-full bg-sree py-3 font-medium text-white">Save memory</button>
    </form>
  );
}
