export type BookingArtistStatus =
  | "AVAILABLE"
  | "BOOKS_CLOSED"
  | "WAITLIST_ONLY"
  | "INACTIVE";

export type BookingArtistOption = {
  id: string;
  name: string;
  nameZh: string | null;
  bookedUntil: string | null;
  status: BookingArtistStatus;
};

export function toBookingArtistOption(artist: {
  id: string;
  name: string;
  nameZh: string | null;
  bookedUntil: Date | null;
  status: string;
}): BookingArtistOption {
  return {
    id: artist.id,
    name: artist.name,
    nameZh: artist.nameZh,
    bookedUntil: artist.bookedUntil?.toISOString() ?? null,
    status: artist.status as BookingArtistStatus,
  };
}
