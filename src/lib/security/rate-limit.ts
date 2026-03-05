import "server-only";

import { Redis } from "@upstash/redis";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
let redisClient: Redis | null | undefined;

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({
    url,
    token,
  });

  return redisClient;
}

function cleanupExpired(now: number) {
  for (const [key, value] of buckets.entries()) {
    if (value.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function isRateLimitedInMemory(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  cleanupExpired(now);

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count += 1;
  buckets.set(key, current);
  return false;
}

async function isRateLimitedInRedis(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  const redisKey = `ratelimit:${key}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.pexpire(redisKey, windowMs);
  }

  return count > limit;
}

export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    return isRateLimitedInMemory(key, limit, windowMs);
  }

  try {
    return await isRateLimitedInRedis(key, limit, windowMs);
  } catch {
    return isRateLimitedInMemory(key, limit, windowMs);
  }
}
