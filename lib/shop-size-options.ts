/** Parse comma/newline-separated sizes from admin form or live textarea (same rules as server actions). */
export function parseSizeOptionsText(raw: string): string[] {
  const s = raw.trim();
  if (!s) return [];
  const parts = s.split(/[,，\n\r]+/);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const x = part.trim().slice(0, 32);
    if (!x || seen.has(x)) continue;
    seen.add(x);
    out.push(x);
    if (out.length >= 32) break;
  }
  return out;
}

/**
 * Normalize `size_options` from DB / Prisma for shop UI & checkout.
 * Prisma 7 + @prisma/adapter-pg can surface PostgreSQL text[] as a string
 * (`{S,M,L}`) or other shapes; this coerces everything to a clean string[].
 */
export function coerceSizeOptions(value: unknown): string[] {
  if (value == null) return [];

  if (Array.isArray(value)) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const item of value) {
      const s = String(item).trim().slice(0, 32);
      if (s && !seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
    return out;
  }

  if (typeof value === "string") {
    const t = value.trim();
    if (!t || t === "{}") return [];

    if (t.startsWith("[")) {
      try {
        const parsed = JSON.parse(t) as unknown;
        return coerceSizeOptions(parsed);
      } catch {
        /* fall through */
      }
    }

    // PostgreSQL text[] text format: {elem,elem} or {"a","b"}
    if (t.startsWith("{") && t.endsWith("}")) {
      const inner = t.slice(1, -1);
      if (!inner) return [];
      return inner
        .split(",")
        .map((s) => {
          const u = s.trim();
          const unquoted = u.replace(/^"(.*)"$/, "$1");
          return unquoted.trim();
        })
        .filter(Boolean);
    }

    return t
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}
