-- ============================================
-- Supabase Storage: artist-avatars bucket policies
-- ============================================
-- Create the bucket first in Dashboard: Storage > New bucket > "artist-avatars"
-- Set to Public, allow image/jpeg, image/png, image/webp, max 5MB

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artist-avatars');

-- Allow authenticated users to update avatars
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artist-avatars');

-- Allow authenticated users to delete avatars
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artist-avatars');

-- Public read (for public bucket)
CREATE POLICY "Public read for avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'artist-avatars');
