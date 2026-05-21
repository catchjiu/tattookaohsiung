import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingsList } from "@/components/admin/BookingsList";
import {
  deleteBooking,
  updateBookingStatus,
} from "@/app/artist/bookings/actions";

export default async function ArtistBookingsPage() {
  const user = await requireArtist();

  const rows = await prisma.bookingRequest.findMany({
    where: { artistId: user.artistId },
    include: {
      artist: { select: { name: true } },
      references: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const bookings = rows.map((b) => ({
    id: b.id,
    name: b.clientName,
    email: b.clientEmail,
    phone: b.clientPhone,
    style: b.conceptDescription?.split("\n\n")[0] ?? null,
    placement: b.placement,
    size: null,
    description: b.conceptDescription,
    reference_url: b.references[0]?.url ?? null,
    preferred_date: b.preferredDate,
    status: b.status.toLowerCase(),
    created_at: b.createdAt.toISOString(),
    artists: { name: b.artist.name },
  }));

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
          My bookings
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {bookings.length} total · {pendingCount} pending
        </p>
      </div>

      <BookingsList
        bookings={bookings}
        showArtistName={false}
        updateBookingStatus={updateBookingStatus}
        deleteBooking={deleteBooking}
      />
    </div>
  );
}
