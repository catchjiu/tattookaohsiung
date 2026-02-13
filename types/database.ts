export type Artist = {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  specialty: string | null;
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
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
