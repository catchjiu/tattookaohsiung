import type { Prisma } from "@prisma/client";

export const TATTOO_ARTIST_JOB = "TATTOO_ARTIST" as const;
export const PERMANENT_MAKEUP_JOB = "PERMANENT_MAKEUP" as const;

export const ARTIST_JOBS = [TATTOO_ARTIST_JOB, PERMANENT_MAKEUP_JOB] as const;
export type ArtistJobValue = (typeof ARTIST_JOBS)[number];

export function parseArtistJob(
  value: FormDataEntryValue | null
): ArtistJobValue {
  return value === PERMANENT_MAKEUP_JOB
    ? PERMANENT_MAKEUP_JOB
    : TATTOO_ARTIST_JOB;
}

export function artistJobLabel(job: ArtistJobValue): string {
  return job === PERMANENT_MAKEUP_JOB ? "Permanent Makeup" : "Tattoo Artist";
}

export const tattooArtistWhere: Prisma.ArtistWhereInput = {
  job: TATTOO_ARTIST_JOB,
};

export const permanentMakeupArtistWhere: Prisma.ArtistWhereInput = {
  job: PERMANENT_MAKEUP_JOB,
};

export const tattooPortfolioWhere: Prisma.PortfolioImageWhereInput = {
  artist: { job: TATTOO_ARTIST_JOB },
};

export const permanentMakeupPortfolioWhere: Prisma.PortfolioImageWhereInput = {
  artist: { job: PERMANENT_MAKEUP_JOB },
};
