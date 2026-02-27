import { LRUCache } from 'lru-cache'

// Quick & dirty memory store for rate limiting
// For true edge/serverless, use Upstash Redis (e.g. @upstash/ratelimit)
const tokenCache = new LRUCache({
    max: 500,
    ttl: 60000, // 1 minute
})

export async function rateLimit(req) {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limit = 20; // 20 requests per minute

    const currentUsage = tokenCache.get(ip) || 0;

    if (currentUsage >= limit) {
        return false;
    }

    tokenCache.set(ip, currentUsage + 1);
    return true;
}
