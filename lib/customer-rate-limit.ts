import "server-only";

const attempts = new Map<string, { count: number; resetAt: number }>();

/** A small per-process brake on credential stuffing. */
export function checkCustomerRateLimit(key: string, max: number, windowMs: number) {
    const now = Date.now();
    const current = attempts.get(key);
    const next = !current || current.resetAt <= now ? { count: 1, resetAt: now + windowMs } : { count: current.count + 1, resetAt: current.resetAt };
    attempts.set(key, next);
    if (attempts.size > 10000) {
        for (const [entry, value] of attempts) if (value.resetAt <= now) attempts.delete(entry);
    }
    return { allowed: next.count <= max, retryAfter: Math.ceil((next.resetAt - now) / 1000) };
}
