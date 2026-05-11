export type Artist = {
  id: string;
  slug: string;
  name: string;
  name_zh?: string | null;
  bio: string | null;
  bio_zh?: string | null;
  specialty: string | null;
  specialty_zh?: string | null;
  ig_handle: string | null;
  avatar_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtUpload = {
  id: string;
  artist_id: string | null;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  tags: string[];
  display_order: number;
  is_featured: boolean;
  show_in_hero_slider: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  title_zh?: string | null;
  excerpt: string | null;
  excerpt_zh?: string | null;
  content: string;
  content_zh?: string | null;
  cover_image_url: string | null;
  category: string | null;
  category_zh?: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
