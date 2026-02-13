import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArtUploadList } from "./ArtUploadList";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

export default async function AdminGalleryPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const [images, artists] = await Promise.all([
    prisma.portfolioImage.findMany({
      include: { artist: { select: { name: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.artist.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const artUploads = images.map((img) => ({
    id: img.id,
    artist_id: img.artistId,
    title: img.title,
    description: img.altText,
    image_url: img.url,
    thumbnail_url: null,
    tags: img.tags,
    display_order: img.sortOrder,
    is_featured: false,
    created_at: img.createdAt.toISOString(),
    updated_at: img.createdAt.toISOString(),
    artists: { name: img.artist.name },
  }));

  const artistList = artists.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    bio: a.bio,
    specialty: a.specialty,
    ig_handle: igHandle(a.instagramUrl),
    avatar_url: a.avatarUrl,
    display_order: a.sortOrder,
    is_active: a.status !== "INACTIVE",
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
        Gallery
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Upload and manage portfolio pieces with tags.
      </p>
      <div className="mt-8">
        <ArtUploadList artUploads={artUploads} artists={artistList} />
      </div>
    </div>
  );
}
