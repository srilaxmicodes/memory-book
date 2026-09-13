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

## Vercel + Supabase setup

1. Create a Supabase project.
2. Open Project Settings > Database.
3. Copy the PostgreSQL connection string.
4. Add it to your Vercel project environment as `DATABASE_URL`.
5. Add `NEXTAUTH_URL` as your production domain, for example `https://your-app.vercel.app`.
6. Add `NEXTAUTH_SECRET` with a random long secret.
7. Redeploy.

Example:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
SREE_PASSWORD="dhanush123"
DHANUSH_PASSWORD="dhanush123"
```

If you want the database to accept direct Prisma writes during local setup, also add a direct URL in your local `.env`:

```env
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Logins

| Account | Username | Default password |
| ------- | -------- | ---------------- |
| Couple  | `couple` | `dhanush123`     |
| Sree    | `sree`   | `dhanush123`     |
| Dhanush | `dhanush`| `dhanush123`     |

Use the shared `couple` login for the normal app flow. It can add both Sree and Dhanush ratings on the same memory, each out of 10.

## What is stored

- Supabase/PostgreSQL database from `DATABASE_URL`
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
