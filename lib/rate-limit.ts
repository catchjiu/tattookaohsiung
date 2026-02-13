/**
 * In-memory rate limiter for API routes and Server Actions.
 * For production at scale, use Redis. For single VM deployment, this suffices.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

function getKey(identifier: string, action: string): string {
  return `${action}:${identifier}`;
}

function cleanup(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanup, CLEANUP_INTERVAL);
}

export type RateLimitResult =
  | { success: true; remaining: number }
  | { success: false; retryAfter: number };

/**
 * Check rate limit. Returns success or failure with retry-after seconds.
 */
export function rateLimit(
  identifier: string,
  action: string,
  maxRequests: number
): RateLimitResult {
  const key = getKey(identifier, action);
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    store.set(key, entry);
    return { success: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);

  if (entry.count > maxRequests) {
    return {
      success: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { success: true, remaining };
}

/**
 * Get client identifier from request. Prefer IP from headers (behind proxy).
 */
export function getClientIdentifier(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
