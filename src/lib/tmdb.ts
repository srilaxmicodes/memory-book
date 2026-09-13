const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbEnabled() {
  return Boolean(process.env.TMDB_API_KEY);
}

export function posterUrl(path?: string | null, size = "w500") {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}/${size}${path}`;
}

export async function searchMovies(query: string) {
  if (!process.env.TMDB_API_KEY || !query.trim()) return [];
  const url = new URL(`${TMDB_BASE}/search/movie`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).slice(0, 10).map((movie: Record<string, unknown>) => ({
    id: String(movie.id),
    title: movie.title,
    releaseDate: movie.release_date,
    overview: movie.overview,
    posterUrl: posterUrl(movie.poster_path as string | null),
    backdropUrl: posterUrl(movie.backdrop_path as string | null, "w1280"),
  }));
}

export async function movieDetails(id: string) {
  if (!process.env.TMDB_API_KEY) return null;
  const url = new URL(`${TMDB_BASE}/movie/${id}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  url.searchParams.set("append_to_response", "external_ids");
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const movie = await res.json();
  const imdbId = movie.imdb_id || movie.external_ids?.imdb_id || null;
  let imdbRating: string | null = null;
  if (imdbId && process.env.OMDB_API_KEY) {
    const omdb = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`
    );
    if (omdb.ok) {
      const payload = await omdb.json();
      if (payload?.imdbRating && payload.imdbRating !== "N/A") {
        imdbRating = payload.imdbRating;
      }
    }
  }
  return {
    tmdbId: String(movie.id),
    title: movie.title as string,
    overview: (movie.overview as string) ?? "",
    releaseDate: (movie.release_date as string) ?? "",
    genres: ((movie.genres ?? []) as { name: string }[]).map((g) => g.name).join(", "),
    posterUrl: posterUrl(movie.poster_path),
    backdropUrl: posterUrl(movie.backdrop_path, "w1280"),
    imdbId,
    imdbRating,
  };
}
