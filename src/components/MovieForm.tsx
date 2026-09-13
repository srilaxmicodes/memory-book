"use client";

import { useState } from "react";
import { createEntry } from "@/actions/journal";
import { MovieSearch } from "./MovieSearch";
import { RatingField } from "./RatingField";
import { WorthItPicker } from "./WorthItPicker";
import { useRouter } from "next/navigation";

export function MovieForm({ dateKey }: { dateKey: string }) {
  const router = useRouter();
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
    if ("id" in result && result.id) router.push("/home");
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
      <RatingField name="sreeRating" label="Sree’s rating out of 10" colorClass="text-sree" />
      <textarea name="sreeReview" placeholder="Sree’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      <RatingField name="dhanushRating" label="Dhanush’s rating out of 10" colorClass="text-dhanush" />
      <textarea name="dhanushReview" placeholder="Dhanush’s review" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      <textarea name="description" placeholder="Description" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-rose/50 bg-white/70 px-4 py-8 text-center shadow-card">
        <input type="file" name="files" accept="image/*,video/*" multiple className="sr-only" />
        <span className="text-2xl">📷🎥</span>
        <span className="mt-2 font-medium">Upload photos & videos</span>
        <span className="mt-1 text-sm text-muted">They will be saved with this movie.</span>
      </label>
      <WorthItPicker />
      <textarea name="notes" placeholder="Highlight / extra notes" className="w-full rounded-2xl bg-white px-4 py-3 shadow-card outline-none" rows={3} />
      {error && <p className="text-sm text-sree">{error}</p>}
      <button className="w-full rounded-full bg-sree py-3 font-medium text-white">Save movie</button>
    </form>
  );
}
