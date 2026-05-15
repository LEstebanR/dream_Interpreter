import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

async function checkLimit(
  key: string,
  limit: number,
  ttl = 86400
): Promise<{ success: boolean; remaining: number; limit: number }> {
  if (!redis) return { success: true, remaining: limit, limit };

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, ttl);
    }
    const remaining = Math.max(0, limit - count);
    return { success: count <= limit, remaining, limit };
  } catch (err) {
    console.warn("[ratelimit] Redis error, skipping limit:", err);
    return { success: true, remaining: limit, limit };
  }
}

export async function checkAnonLimit(
  ip: string
): Promise<{ success: boolean; remaining: number; limit: number }> {
  return checkLimit(`dream:anon:${ip}`, 3);
}

export async function checkFreeLimit(
  userId: string
): Promise<{ success: boolean; remaining: number; limit: number }> {
  return checkLimit(`dream:free:${userId}`, 5);
}

// 5 registration attempts per IP per 15 minutes
export async function checkRegisterLimit(
  ip: string
): Promise<{ success: boolean }> {
  return checkLimit(`auth:register:${ip}`, 5, 900);
}

// 3 forgot-password requests per IP per hour
export async function checkForgotPasswordLimit(
  ip: string
): Promise<{ success: boolean }> {
  return checkLimit(`auth:forgot-password:${ip}`, 3, 3600);
}
