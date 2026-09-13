"use client";

import { useState } from "react";
import { createEntry } from "@/actions/journal";
import { MovieSearch } from "./MovieSearch";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { useRouter } from "next/navigation";
import { isSree } from "@/lib/constants";

export function MovieForm({ dateKey, username }: { dateKey: string; username: string }) {
  const router = useRouter();
  const mine = isSree(username);
  const [movie, setMovie] = useState({
    title: "",
    posterUrl: "",
    backdropUrl: "",
    releaseDate: "",
    genres: "",
    overview: "",
    tmdbId: "",
    imdbId: "",
    imdbRating: "",
  });
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    formData.set("category", "MOVIE");
    formData.set("dateKey", dateKey);
    Object.entries(movie).forEach(([key, value]) => formData.set(key, value));
    const result = await createEntry(formData);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    if ("id" in result && result.id) router.push(`/entry/${result.id}`);
  }

  return (
    <form action={submit} className="space-y-5">
      <MovieSearch
        onSelect={(picked) =>
          setMovie({
            title: picked.title || "",
            posterUrl: picked.posterUrl || "",
            backdropUrl: picked.backdropUrl || "",
            releaseDate: picked.releaseDate || "",
            genres: picked.genres || "",
            overview: picked.overview || "",
            tmdbId: picked.tmdbId || picked.id,
            imdbId: picked.imdbId || "",
            imdbRating: picked.imdbRating || "",
          })
        }
      />
      <input
        name="title"
        value={movie.title}
        onChange={(e) => setMovie({ ...movie, title: e.target.value })}
        placeholder="Movie title"
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none"
        required
      />
      {movie.posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={movie.posterUrl} alt="" className="h-64 w-44 rounded-3xl object-cover shadow-soft" />
      )}
      <input
        name="cost"
        type="number"
        min="0"
        step="1"
        placeholder="Cost in ₹"
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none"
      />
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
      <button className="w-full rounded-full bg-sree py-3 font-medium text-white">Save movie</button>
    </form>
  );
}
