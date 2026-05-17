/**
 * Simple in-memory rate limiter for API routes.
 * No external dependencies — uses a Map with automatic cleanup.
 * Suitable for single-instance deployments (Vercel serverless).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Check if a request should be rate-limited.
 * Returns { success: true } if allowed, { success: false, retryAfter } if blocked.
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { success: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (entry.count < limit) {
    entry.count++
    return { success: true }
  }

  return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
}
