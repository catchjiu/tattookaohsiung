import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArtistSidebar } from "@/components/artist/ArtistSidebar";

export const dynamic = "force-dynamic";

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  const showSidebar = user?.role === "ARTIST" && !!user.artistId;

  let artistName = "Artist";
  if (showSidebar && user.artistId) {
    const artist = await prisma.artist.findUnique({
      where: { id: user.artistId },
      select: { name: true },
    });
    artistName = artist?.name ?? artistName;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSidebar && <ArtistSidebar artistName={artistName} />}
      <div
        className={`min-h-screen pt-14 md:pt-0 pb-[env(safe-area-inset-bottom,1rem)] ${showSidebar ? "md:pl-56" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
