import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArtistList } from "./ArtistList";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

export default async function AdminArtistsPage() {
  await requireAdmin();

  const artists = await prisma.artist.findMany({
    include: { user: { select: { email: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const artistList = artists.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    name_zh: a.nameZh,
    bio: a.bio,
    bio_zh: a.bioZh,
    specialty: a.specialty,
    specialty_zh: a.specialtyZh,
    email: a.email,
    ig_handle: igHandle(a.instagramUrl),
    avatar_url: a.avatarUrl,
    display_order: a.sortOrder,
    is_active: a.status !== "INACTIVE",
    dashboard_email: a.user?.email ?? null,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 pb-8 sm:p-6 md:p-8">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        Artists
      </h1>
      <p className="mt-2 text-foreground-muted">
        Manage artist profiles and assign dashboard logins for bookings and portfolio updates.
      </p>
      <div className="mt-8">
        <ArtistList artists={artistList} />
      </div>
    </div>
  );
}
