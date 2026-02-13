-- ============================================
-- Supabase Storage: gallery-art bucket policies
-- ============================================
-- Create the bucket first in Dashboard: Storage > New bucket > "gallery-art"
-- Set to Public, allow image/jpeg, image/png, image/webp, image/gif, max 10MB

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload gallery art"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-art');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update gallery art"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-art');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete gallery art"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-art');

-- Public read
CREATE POLICY "Public read for gallery art"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-art');
