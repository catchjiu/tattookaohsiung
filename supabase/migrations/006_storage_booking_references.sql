-- ============================================
-- Supabase Storage: booking-references bucket policies
-- ============================================
-- Create the bucket first in Dashboard: Storage > New bucket > "booking-references"
-- Set to Public, allow image/jpeg, image/png, image/webp, image/gif, max 5MB
--
-- Uploads are done server-side via service role (bypasses RLS), so no anon policy needed.

-- Public read (for displaying reference images)
CREATE POLICY "Public read for booking references"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'booking-references');
