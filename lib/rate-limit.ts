import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// General API rate limit: 10 requests per 60 seconds
const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "whispr:general",
});

// Registration rate limit: 3 accounts per month per IP
const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "30 d"),
  prefix: "whispr:register",
});

export async function checkRateLimit(identifier: string) {
  const { success, remaining, reset } = await generalLimiter.limit(identifier);
  return { allowed: success, remaining, resetAt: reset };
}

export async function checkRegistrationLimit(identifier: string) {
  const { success, remaining, reset } = await registrationLimiter.limit(identifier);
  return { allowed: success, remaining, resetAt: reset };
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
