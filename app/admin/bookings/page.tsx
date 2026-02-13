import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingsList } from "@/components/admin/BookingsList";

export default async function AdminBookingsPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const rows = await prisma.bookingRequest.findMany({
    include: { artist: { select: { name: true } } },
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
    reference_url: null,
    preferred_date: null,
    status: b.status.toLowerCase(),
    created_at: b.createdAt.toISOString(),
    artists: { name: b.artist.name },
  }));

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
            Bookings
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {bookings.length} total · {pendingCount} pending
          </p>
        </div>
      </div>

      <BookingsList bookings={bookings} />
    </div>
  );
}
