// ============================================
// packages/redis/src/services/rateLimiter.ts
// All functions, no classes! With detailed explanations
// ============================================
import { Redis } from "ioredis";
import { getRedisClient } from "../client";

export interface RateLimitResult {
  allowed: boolean; // Can the request proceed?
  remaining: number; // How many attempts left?
  resetAt: Date; // When does the limit reset?
  limit: number; // Total attempts allowed
}

export interface RateLimitConfig {
  maxAttempts: number; // e.g., 5 attempts
  windowSeconds: number; // e.g., 900 seconds (15 minutes)
  blockDurationSeconds?: number; // Optional: block for X seconds after exceeding
}

/**
 * SLIDING WINDOW RATE LIMITER
 *
 * How it works:
 * 1. Stores each request with timestamp in a sorted list
 * 2. Removes old requests outside the time window
 * 3. Counts remaining requests
 * 4. More accurate but uses slightly more memory
 *
 * Example: If window is 15 minutes, it only counts requests from last 15 mins
 */
export async function checkSlidingWindowRateLimit(
  identifier: string, // e.g., "login:email:user@example.com"
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const { maxAttempts, windowSeconds } = config;

  // Create unique key for this rate limit
  const redisKey = `rate:${identifier}`;

  // Get current time in milliseconds
  const currentTimeMs = Date.now();

  // Calculate window start time (e.g., 15 minutes ago)
  const windowStartMs = currentTimeMs - windowSeconds * 1000;

  // MULTI = Run multiple Redis commands together (atomically)
  const pipeline = redis.multi();

  // 1. Remove old entries outside the time window
  //    ZREMRANGEBYSCORE = Remove items from sorted set by score range
  //    Score here = timestamp, so we remove entries older than windowStartMs
  pipeline.zremrangebyscore(redisKey, 0, windowStartMs);

  // 2. Count how many requests are in the current window
  //    ZCARD = Count items in sorted set
  pipeline.zcard(redisKey);

  // 3. Add current request to the sorted set
  //    ZADD = Add to sorted set with score (timestamp)
  //    We store current time as both score and value
  pipeline.zadd(redisKey, currentTimeMs, `${currentTimeMs}`);

  // 4. Set expiry on the key (auto-delete after windowSeconds)
  //    EXPIRE = Set Time To Live (TTL) on key
  pipeline.expire(redisKey, windowSeconds);

  // Execute all commands together
  const results = await pipeline.exec();

  if (!results) {
    throw new Error("Redis transaction failed");
  }

  // results[1] = the count from ZCARD command (before we added new request)
  const requestCountBeforeAdding = (results[1][1] as number) || 0;

  // Check if request is allowed
  const allowed = requestCountBeforeAdding < maxAttempts;

  // Calculate remaining attempts (subtract 1 because we already added current request)
  const remaining = Math.max(0, maxAttempts - requestCountBeforeAdding - 1);

  // Calculate when limit resets
  const resetAt = new Date(currentTimeMs + windowSeconds * 1000);

  return {
    allowed,
    remaining,
    resetAt,
    limit: maxAttempts,
  };
}

/**
 * FIXED WINDOW RATE LIMITER
 *
 * How it works:
 * 1. Each time window gets a counter
 * 2. Increment counter for each request
 * 3. Reset counter when window expires
 * 4. Simpler and faster, but less accurate at window boundaries
 *
 * Example: If limit is 5 per 15 mins, you could theoretically make
 *          10 requests (5 at end of window 1, 5 at start of window 2)
 */
export async function checkFixedWindowRateLimit(
  identifier: string, // e.g., "login:email:user@example.com"
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const { maxAttempts, windowSeconds } = config;

  // Create unique key for this rate limit
  const redisKey = `rate:${identifier}`;

  const currentTimeMs = Date.now();

  // MULTI = Run multiple commands together
  const pipeline = redis.multi();

  // 1. Increment counter by 1
  //    INCR = Add 1 to number (creates key if doesn't exist, starting at 0)
  pipeline.incr(redisKey);

  // 2. Get TTL (Time To Live) - seconds until key expires
  //    TTL = Get remaining time until key auto-deletes
  pipeline.ttl(redisKey);

  // Execute commands
  const results = await pipeline.exec();

  if (!results) {
    throw new Error("Redis transaction failed");
  }

  const requestCount = results[0][1] as number; // Current count
  const timeToLive = results[1][1] as number; // Seconds until expiry

  // If TTL is -1, key has no expiry set yet (first request in window)
  if (timeToLive === -1) {
    await redis.expire(redisKey, windowSeconds);
  }

  // Check if request is allowed
  const allowed = requestCount <= maxAttempts;

  // Calculate remaining attempts
  const remaining = Math.max(0, maxAttempts - requestCount);

  // Calculate when limit resets
  const resetAt = new Date(
    currentTimeMs + (timeToLive > 0 ? timeToLive * 1000 : windowSeconds * 1000)
  );

  return {
    allowed,
    remaining,
    resetAt,
    limit: maxAttempts,
  };
}

/**
 * BLOCK an identifier completely for a duration
 * Used after too many failed attempts
 *
 * Example: Block user@example.com for 30 minutes
 */
export async function blockIdentifier(
  identifier: string,
  durationSeconds: number
): Promise<void> {
  const redis = getRedisClient();
  const blockKey = `block:${identifier}`;

  // SETEX = Set value with expiry
  // Store "1" (true) for durationSeconds
  await redis.setex(blockKey, durationSeconds, "1");
}

/**
 * CHECK if identifier is blocked
 */
export async function isIdentifierBlocked(
  identifier: string
): Promise<boolean> {
  const redis = getRedisClient();
  const blockKey = `block:${identifier}`;

  // GET = Retrieve value
  // Returns null if key doesn't exist
  const value = await redis.get(blockKey);

  return value !== null; // Blocked if value exists
}

/**
 * GET remaining block time in seconds
 */
export async function getBlockTimeRemaining(
  identifier: string
): Promise<number> {
  const redis = getRedisClient();
  const blockKey = `block:${identifier}`;

  // TTL = Get seconds until key expires
  const timeToLive = await redis.ttl(blockKey);

  return timeToLive > 0 ? timeToLive : 0;
}

/**
 * CLEAR rate limit and block for an identifier
 * Useful for admin tools or testing
 */
export async function clearRateLimit(identifier: string): Promise<void> {
  const redis = getRedisClient();
  const rateKey = `rate:${identifier}`;
  const blockKey = `block:${identifier}`;

  // DEL = Delete keys
  await redis.del(rateKey, blockKey);
}
