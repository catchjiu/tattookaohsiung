import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isCurrentlyBooked, formatBookedUntil } from "@/lib/artist-availability";
import { ArtistProfileForm } from "./ArtistProfileForm";

export default async function ArtistProfilePage() {
  const user = await requireArtist();

  const artist = await prisma.artist.findUnique({
    where: { id: user.artistId },
    select: { name: true, bookedUntil: true },
  });

  if (!artist) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-foreground-muted">Artist profile not found.</p>
      </div>
    );
  }

  const booked = isCurrentlyBooked(artist.bookedUntil);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
        My profile
      </h1>
      <p className="mt-2 text-foreground-muted">
        Update your availability shown on your public artist page.
      </p>

      {booked && artist.bookedUntil && (
        <p className="mt-4 inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Currently showing as booked until{" "}
          {formatBookedUntil(artist.bookedUntil, "en")}
        </p>
      )}

      <ArtistProfileForm
        bookedUntil={artist.bookedUntil?.toISOString() ?? null}
      />
    </div>
  );
}
