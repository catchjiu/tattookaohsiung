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
