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
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

Copy these from your `.env.local` or Supabase Dashboard → Settings → API.

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

## Troubleshooting

- **Build fails**: Check the build logs in Coolify. Ensure `package-lock.json` exists.
- **App won't start**: Verify `Ports Exposes` is set to `3000`.
- **Blank page / API errors**: Confirm env vars are set in Coolify (they're not in the repo).
