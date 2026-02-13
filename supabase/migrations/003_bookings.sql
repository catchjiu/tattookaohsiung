-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  style VARCHAR(255),              -- e.g., Traditional, Fine-line, Realism
  placement VARCHAR(255),           -- Body placement
  size VARCHAR(100),                -- e.g., Small, Medium, Large
  description TEXT,                 -- Tattoo idea/vision
  reference_url TEXT,               -- Link to reference image
  preferred_artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  preferred_date TEXT,              -- Flexible date preference
  status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a booking (no auth required)
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
TO anon
WITH CHECK (true);

-- Only authenticated (admin) can read/update
CREATE POLICY "Admins can manage bookings"
ON bookings FOR ALL
TO authenticated
USING (true);
