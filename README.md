# Tattoo Kaohsiung

Premium tattoo studio web app for Kaohsiung. Chic dark aesthetic with Old Gold accents.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # Add your Supabase credentials
npm run dev
```

## Database Setup

Run the migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor to create:

- **artists** – Artist profiles (bio, specialty, IG handle)
- **art_uploads** – Portfolio pieces with tags
- **blog_posts** – Markdown/CMS-lite blog
- **ig_feed** – Curated Instagram links

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the full folder layout.

## Deployment (Docker)

Runs on a single Google Cloud Compute Engine VM (e2-standard-2 or similar).

```bash
# 1. Create env file
cp .env.docker.example .env
# Edit .env — set POSTGRES_PASSWORD, Supabase keys, etc.

# 2. Build and run
docker compose up -d

# App: http://localhost:3000
# PostgreSQL: internal (app connects via DATABASE_URL)
```

### First-time setup

- **Prisma**: Migrations run automatically on startup.
- **Seed data**: If using Prisma, add at least one Artist for bookings:
  `npx prisma db seed` (or insert via SQL).
- **Supabase**: If not using local Prisma, configure Supabase in `.env` for artists/gallery.
