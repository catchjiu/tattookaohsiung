-- ============================================
-- Tattoo Kaohsiung - Initial Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ARTISTS
-- ============================================
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  specialty VARCHAR(255),           -- e.g., "Traditional", "Fine-line", "Realism"
  ig_handle VARCHAR(100),           -- Instagram handle (without @)
  avatar_url TEXT,                   -- Supabase Storage URL
  display_order INTEGER DEFAULT 0,  -- For manual ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing and filtering
CREATE INDEX idx_artists_active_order ON artists(is_active, display_order);
CREATE INDEX idx_artists_slug ON artists(slug);

-- ============================================
-- ART_UPLOADS (Portfolio / Gallery)
-- ============================================
CREATE TABLE art_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,           -- Supabase Storage URL (high-res)
  thumbnail_url TEXT,                -- Optional optimized thumbnail
  tags TEXT[],                       -- e.g., ['Traditional', 'Fine-line', 'Realism']
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_art_uploads_artist ON art_uploads(artist_id);
CREATE INDEX idx_art_uploads_tags ON art_uploads USING GIN(tags);
CREATE INDEX idx_art_uploads_featured ON art_uploads(is_featured) WHERE is_featured = true;

-- ============================================
-- BLOG_POSTS
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,             -- Markdown or HTML
  cover_image_url TEXT,
  category VARCHAR(100),             -- e.g., "Studio News", "Aftercare Tips"
  author_id UUID,                    -- Optional: link to admin user
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

-- ============================================
-- IG_FEED (Curated Instagram links or cached data)
-- ============================================
CREATE TABLE ig_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  post_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ig_feed_artist ON ig_feed(artist_id);

-- ============================================
-- RLS (Row Level Security) - Supabase
-- ============================================
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ig_feed ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Artists are viewable by everyone" ON artists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Art uploads are viewable by everyone" ON art_uploads
  FOR SELECT USING (true);

CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (is_published = true AND published_at <= NOW());

CREATE POLICY "IG feed is viewable by everyone" ON ig_feed
  FOR SELECT USING (true);

-- Admin-only policies (authenticated users with admin role)
-- Note: Adjust role check based on your auth setup
CREATE POLICY "Admins can manage artists" ON artists
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage art_uploads" ON art_uploads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage ig_feed" ON ig_feed
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_art_uploads_updated_at
  BEFORE UPDATE ON art_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
