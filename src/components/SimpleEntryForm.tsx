"use client";

import { createEntry } from "@/actions/journal";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { useRouter } from "next/navigation";
import { isSree } from "@/lib/constants";
import { useState } from "react";

export function SimpleEntryForm({
  dateKey,
  username,
  category,
}: {
  dateKey: string;
  username: string;
  category: "FOOD" | "PLACE" | "OTHER";
}) {
  const router = useRouter();
  const mine = isSree(username);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    formData.set("category", category);
    formData.set("dateKey", dateKey);
    const result = await createEntry(formData);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    if ("id" in result && result.id) router.push(`/entry/${result.id}`);
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
      {category === "OTHER" && (
        <textarea name="description" placeholder="What happened?" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      )}
      <input name="cost" type="number" min="0" step="1" placeholder="Cost in ₹" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" />
      {mine ? (
        <>
          <RatingField name="sreeRating" label="Sree’s rating" colorClass="text-sree" />
          <textarea name="sreeReview" placeholder="Sree’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        </>
      ) : (
        <>
          <RatingField name="dhanushRating" label="Dhanush’s rating" colorClass="text-dhanush" />
          <textarea name="dhanushReview" placeholder="Dhanush’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
        </>
      )}
      <WorthItPicker />
      <textarea name="notes" placeholder="Highlight / extra notes" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      {error && <p className="text-sm text-sree">{error}</p>}
      <button className="w-full rounded-full bg-sree py-3 font-medium text-white">Save memory</button>
    </form>
  );
}
