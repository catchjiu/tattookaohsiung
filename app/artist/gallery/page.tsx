import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArtUploadList } from "@/app/admin/gallery/ArtUploadList";
import {
  createArtUpload,
  deleteArtUpload,
  updateArtUpload,
} from "@/app/artist/gallery/actions";

export default async function ArtistGalleryPage() {
  const user = await requireArtist();

  const [images, artist] = await Promise.all([
    prisma.portfolioImage.findMany({
      where: { artistId: user.artistId },
      include: {
        artist: { select: { name: true } },
        assets: { orderBy: { sortOrder: "asc" }, select: { url: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.artist.findUnique({
      where: { id: user.artistId },
      select: { id: true, slug: true, name: true, bio: true, specialty: true, sortOrder: true, status: true, createdAt: true, updatedAt: true },
    }),
  ]);

  const artUploads = images.map((img) => ({
    id: img.id,
    artist_id: img.artistId,
    title: img.title,
    title_zh: img.titleZh,
    description: img.altText,
    description_zh: img.altTextZh,
    image_url: img.url,
    image_urls: img.assets.map((a) => a.url),
    thumbnail_url: null,
    tags: img.tags,
    tags_zh: img.tagsZh,
    display_order: img.sortOrder,
    is_featured: false,
    show_in_hero_slider: img.showInHeroSlider,
    created_at: img.createdAt.toISOString(),
    updated_at: img.createdAt.toISOString(),
    artists: { name: img.artist.name },
  }));

  const artistList = artist
    ? [
        {
          id: artist.id,
          slug: artist.slug,
          name: artist.name,
          bio: artist.bio,
          specialty: artist.specialty,
          ig_handle: null,
          avatar_url: null,
          display_order: artist.sortOrder,
          is_active: artist.status !== "INACTIVE",
          created_at: artist.createdAt.toISOString(),
          updated_at: artist.updatedAt.toISOString(),
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
        My portfolio
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Upload and manage your artwork shown on the public gallery.
      </p>
      <div className="mt-8">
        <ArtUploadList
          artUploads={artUploads}
          artists={artistList}
          fixedArtistId={user.artistId}
          showArtistName={false}
          allowHeroSlider={false}
          createArtUpload={createArtUpload}
          updateArtUpload={updateArtUpload}
          deleteArtUpload={deleteArtUpload}
        />
      </div>
    </div>
  );
}
