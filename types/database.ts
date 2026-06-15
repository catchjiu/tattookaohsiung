export type Artist = {
  id: string;
  slug: string;
  name: string;
  name_zh?: string | null;
  bio: string | null;
  bio_zh?: string | null;
  specialty: string | null;
  specialty_zh?: string | null;
  job?: "TATTOO_ARTIST" | "PERMANENT_MAKEUP";
  email?: string | null;
  ig_handle: string | null;
  avatar_url: string | null;
  display_order: number;
  is_active: boolean;
  dashboard_email?: string | null;
  booked_until?: string | null;
  created_at: string;
  updated_at: string;
};

export type ArtUpload = {
  id: string;
  artist_id: string | null;
  title: string | null;
  title_zh?: string | null;
  description: string | null;
  description_zh?: string | null;
  image_url: string;
  image_urls?: string[];
  thumbnail_url: string | null;
  tags: string[];
  tags_zh?: string[];
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

export type Video = {
  id: string;
  slug: string;
  title: string;
  title_zh?: string | null;
  excerpt: string | null;
  excerpt_zh?: string | null;
  content: string;
  content_zh?: string | null;
  youtube_url: string;
  youtube_id: string;
  sort_order: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ShopProductSizeStock = {
  size: string;
  quantity: number;
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  name_zh?: string | null;
  description: string;
  description_zh?: string | null;
  price_label: string | null;
  price_twd?: number | null;
  size_options?: string[];
  /** Per-size inventory when product has sizes (missing size = unlimited). */
  size_stocks?: ShopProductSizeStock[];
  /** Single-SKU stock when product has no sizes; null = unlimited */
  stock_quantity?: number | null;
  image_url: string | null;
  image_urls?: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
