import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ComingSoon } from "@/components/home/ComingSoon";

export default async function HomePage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    select: { id: true, name: true, specialty: true, avatarUrl: true, slug: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <ComingSoon
      artists={artists.map((a) => ({
        id: a.id,
        name: a.name,
        specialty: a.specialty,
        avatar_url: a.avatarUrl,
        slug: a.slug,
      }))}
    />
  );
}
