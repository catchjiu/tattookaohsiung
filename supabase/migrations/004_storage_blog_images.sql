-- ============================================
-- Supabase Storage: blog-images bucket policies
-- ============================================
-- Create the bucket first in Dashboard: Storage > New bucket > "blog-images"
-- Set to Public, allow image/jpeg, image/png, image/webp, image/gif, max 5MB

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Public read
CREATE POLICY "Public read for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
