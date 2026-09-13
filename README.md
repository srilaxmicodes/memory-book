# Memory Book

A private full-stack journal for **Sree** and **Dhanush**. Movies, food, places, other experiences, photos, videos, costs, and daily highlights are stored in a real database — nothing is fake demo data.

## Run locally

```bash
cd memory-book
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Logins

| Person  | Username | Default password |
| ------- | -------- | ---------------- |
| Sree    | `sree`   | `sree123`        |
| Dhanush | `dhanush`| `dhanush123`     |

Change passwords in `.env` (`SREE_PASSWORD`, `DHANUSH_PASSWORD`), then run `npx prisma db seed` again.

## What is stored

- SQLite database at `prisma/dev.db` (path from `DATABASE_URL`)
- Photos and videos in `public/uploads` unless Cloudinary env vars are set
- Each entry keeps who created it, both ratings/reviews, cost, worth-it, and media

## Optional APIs

Copy `.env.example` values into `.env`:

- `TMDB_API_KEY` — movie search, posters, genres, IMDb id
- `OMDB_API_KEY` — IMDb rating when a movie has an IMDb id
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — cloud media instead of local files

This app does not scrape IMDb.

## Stack

Next.js App Router, Prisma, SQLite, NextAuth (credentials for exactly two users), local or Cloudinary uploads.
