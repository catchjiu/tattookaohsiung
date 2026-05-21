# Deploy Tattoo Kaohsiung to Coolify

## Prerequisites

- A server with Coolify installed ([coolify.io](https://coolify.io))
- Your code pushed to GitHub (or GitLab)
- Supabase project set up with migrations run

---

## Step 1: Push to GitHub

If you haven't already:

```bash
cd KH-Tattoo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Create Application in Coolify

1. Log in to your Coolify dashboard.
2. Create a **new project** (e.g. "Tattoo Kaohsiung").
3. Click **+ Add Resource** → **Application**.
4. Choose **GitHub** (or your Git provider) and connect your repository.
5. Select the repo and branch (e.g. `main`).

---

## Step 3: Configure Build Settings

| Setting | Value |
|--------|-------|
| **Build Pack** | `Dockerfile` |
| **Ports Exposes** | `3000` |

The project includes a `Dockerfile` in the root, so Coolify will use it automatically.

---

## Step 4: Add Environment Variables

In Coolify, go to your application → **Environment Variables** and add:

| Variable | Value |
|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/db`) |
| `ADMIN_EMAIL` | Your admin login email (e.g. `you@example.com`) — also receives shop order & booking notifications |
| `ADMIN_PASSWORD` | Your admin password |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key — required for booking & shop confirmation emails |
| `EMAIL_FROM` | Verified sender in Resend (e.g. `orders@tattookaohsiung.com`) |
| `SHOP_ORDER_EMAIL` | Optional — override where shop order alerts are sent (defaults to `ADMIN_EMAIL`) |
| `BOOKING_EMAIL` | Optional — override where booking alerts are sent (defaults to `ADMIN_EMAIL`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://tattookaohsiung.com`) — used in admin email links |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Important:** Enable **"Available at Runtime"** for these variables (not just at build time):

- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — admin login is synced on container start
- `RESEND_API_KEY` and `EMAIL_FROM` — required for booking & shop confirmation emails

`EMAIL_FROM` must be a **verified domain/sender** in your [Resend](https://resend.com) dashboard (e.g. `bookings@tattookaohsiung.com`). Without it, orders and bookings save but no email is sent.

Copy other values from your `.env.local` or Supabase Dashboard → Settings → API.

---

## Step 5: Deploy

1. Click **Deploy**.
2. Coolify will build the Docker image and start the container.
3. Wait for the build to complete (usually 2–5 minutes).

---

## Step 6: Custom Domain (Optional)

1. In Coolify, go to your application → **Domains**.
2. Add your domain (e.g. `tattookaohsiung.com`).
3. Point your domain's DNS to the server (A record or CNAME as Coolify instructs).
4. Coolify will handle SSL via Let's Encrypt.

---

## Database migrations (Supabase & production)

Each deploy runs `npx prisma migrate deploy` in the container entrypoint, so **new migrations are applied automatically** when you push and redeploy.

To apply manually (e.g. before first deploy or from your laptop):

```bash
# Same DATABASE_URL as production (direct or pooler + ?sslmode=require)
npx prisma migrate deploy
```

Or run the SQL from `prisma/migrations/<timestamp>_*/migration.sql` in **Supabase → SQL Editor** if you cannot use the CLI.

After adding the **shop** feature, ensure migration `20260511120000_add_shop_products` is deployed so the `shop_products` table exists.

---

## Troubleshooting

- **Build fails**: Check the build logs in Coolify. Ensure `package-lock.json` exists.
- **App won't start**: Verify `Ports Exposes` is set to `3000`.
- **Blank page / API errors**: Confirm env vars are set in Coolify (they're not in the repo).
