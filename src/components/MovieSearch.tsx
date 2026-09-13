"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: string;
  title: string;
  releaseDate?: string;
  overview?: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
};

type Details = Movie & {
  tmdbId: string;
  genres?: string;
  imdbId?: string | null;
  imdbRating?: string | null;
};

export function MovieSearch({
  onSelect,
}: {
  onSelect: (movie: Details) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setEnabled(data.enabled);
      setResults(data.results || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  async function pick(movie: Movie) {
    const res = await fetch(`/api/movies/${movie.id}`);
    if (res.ok) {
      onSelect(await res.json());
    } else {
      onSelect({
        ...movie,
        tmdbId: movie.id,
      });
    }
  }

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for a movie"
        className="w-full rounded-2xl border-0 bg-white px-4 py-3 shadow-card outline-none"
      />
      {!enabled && (
        <p className="text-sm text-muted">
          No TMDB key is set, so type the title below and add a poster yourself.
        </p>
      )}
      {loading && <p className="text-sm text-muted">Searching…</p>}
      <div className="grid gap-3">
        {results.map((movie) => (
          <button
            type="button"
            key={movie.id}
            onClick={() => pick(movie)}
            className="flex gap-3 rounded-2xl bg-white p-3 text-left shadow-card"
          >
            {movie.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={movie.posterUrl} alt="" className="h-20 w-14 rounded-xl object-cover" />
            ) : (
              <div className="flex h-20 w-14 items-center justify-center rounded-xl bg-blush">🎬</div>
            )}
            <span>
              <span className="block font-medium">{movie.title}</span>
              <span className="text-sm text-muted">{movie.releaseDate}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
