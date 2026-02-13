# Avatar Upload Setup

For the artist avatar photo upload to work, create a Supabase Storage bucket:

## 1. Create the bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Storage** → **New bucket**
3. Name: `artist-avatars`
4. **Public bucket**: Yes (so avatars display on the site)
5. **File size limit**: 5 MB
6. **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
7. Click **Create bucket**

## 2. Run the storage policies migration

Run the SQL in `supabase/migrations/002_storage_avatars.sql` in the Supabase SQL Editor to add RLS policies for authenticated uploads.

---

# Blog Images Setup

For the blog rich text editor image upload to work, create a Supabase Storage bucket:

## 1. Create the bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Storage** → **New bucket**
3. Name: `blog-images`
4. **Public bucket**: Yes
5. **File size limit**: 5 MB
6. **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
7. Click **Create bucket**

## 2. Run the storage policies migration

Run the SQL in `supabase/migrations/004_storage_blog_images.sql` in the Supabase SQL Editor.

---

# Gallery Art Setup

For the gallery artwork photo upload to work, create a Supabase Storage bucket:

## 1. Create the bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Storage** → **New bucket**
3. Name: `gallery-art`
4. **Public bucket**: Yes
5. **File size limit**: 10 MB
6. **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
7. Click **Create bucket**

## 2. Run the storage policies migration

Run the SQL in `supabase/migrations/005_storage_gallery_art.sql` in the Supabase SQL Editor.

---

# Booking References Setup

For the booking form reference photo upload to work, create a Supabase Storage bucket and add the service role key.

## 1. Add service role key

Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`. Find it in Supabase Dashboard → **Settings** → **API** → **Service role** (secret).

## 2. Create the bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Storage** → **New bucket**
3. Name: `booking-references`
4. **Public bucket**: Yes
5. **File size limit**: 5 MB
6. **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
7. Click **Create bucket**

## 3. Run the storage policies migration

Run the SQL in `supabase/migrations/006_storage_booking_references.sql` in the Supabase SQL Editor.
