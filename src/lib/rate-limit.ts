import { Redis } from "@upstash/redis";
import {
  RATE_LIMIT_MAX_CREATES,
  RATE_LIMIT_WINDOW_SECONDS,
} from "./constants";

function getMemoryCounters(): Map<
  string,
  { count: number; expiresAt: number }
> {
  const globalCounters = globalThis as typeof globalThis & {
    __embedRateLimitCounters?: Map<string, { count: number; expiresAt: number }>;
  };

  if (!globalCounters.__embedRateLimitCounters) {
    globalCounters.__embedRateLimitCounters = new Map();
  }

  return globalCounters.__embedRateLimitCounters;
}

function hasRedisConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getHourBucket(): string {
  return Math.floor(Date.now() / (RATE_LIMIT_WINDOW_SECONDS * 1000)).toString();
}

function rateLimitKey(ip: string): string {
  return `rate:create:${ip}:${getHourBucket()}`;
}

async function incrementRedisCounter(key: string): Promise<number> {
  const redis = Redis.fromEnv();
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }

  return count;
}

function incrementMemoryCounter(key: string): number {
  const memoryCounters = getMemoryCounters();
  const now = Date.now();
  const existing = memoryCounters.get(key);

  if (!existing || existing.expiresAt <= now) {
    memoryCounters.set(key, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000,
    });
    return 1;
  }

  existing.count += 1;
  return existing.count;
}

export async function checkCreateRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const key = rateLimitKey(ip);

  const count = hasRedisConfig()
    ? await incrementRedisCounter(key)
    : incrementMemoryCounter(key);

  const remaining = Math.max(RATE_LIMIT_MAX_CREATES - count, 0);

  return {
    allowed: count <= RATE_LIMIT_MAX_CREATES,
    remaining,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}
