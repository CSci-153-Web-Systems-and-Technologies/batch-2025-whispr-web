import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "whispr",
});

export async function checkRateLimit(identifier: string) {
  const { success, remaining, reset } = await ratelimit.limit(identifier);
  return { allowed: success, remaining, resetAt: reset };
}

export function getClientIdentifier(request: Request, userId?: string) {
  if (userId) return `user:${userId}`;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}
