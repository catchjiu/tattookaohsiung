import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArtistList } from "./ArtistList";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

export default async function AdminArtistsPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const artists = await prisma.artist.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

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
        Artists
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Manage artist profiles (Bio, Specialty, IG Handle).
      </p>
      <div className="mt-8">
        <ArtistList artists={artistList} />
      </div>
    </div>
  );
}
