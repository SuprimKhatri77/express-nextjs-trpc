// Simple function to check rate limits in your tRPC routes
// ============================================
import { TRPCError } from "@trpc/server";
import {
  checkSlidingWindowRateLimit,
  checkFixedWindowRateLimit,
  isIdentifierBlocked,
  getBlockTimeRemaining,
  blockIdentifier,
  RateLimitConfig,
} from "../../../redis/src/index";
import { Context } from "../context";

export interface RateLimitMiddlewareConfig extends RateLimitConfig {
  keyPrefix: string; // e.g., "login", "forgot-password", "signup"
  useEmail?: boolean; // Rate limit by email (true) or IP (false)
  useSlidingWindow?: boolean; // Use sliding (true) or fixed (false) window
}

/**
 * CHECK RATE LIMIT
 * Call this function before processing the request
 *
 * How to use:
 * await checkRateLimit(ctx, {
 *   keyPrefix: "login",
 *   maxAttempts: 5,
 *   windowSeconds: 900,
 *   useEmail: true
 * }, email);
 */
export async function checkRateLimit(
  ctx: Context,
  config: RateLimitMiddlewareConfig,
  email?: string
): Promise<void> {
  // Step 1: Create unique identifier for this rate limit
  let identifier: string;

  if (config.useEmail && email) {
    // Rate limit by email (better for login protection)
    identifier = `${config.keyPrefix}:email:${email}`;
  } else {
    // Rate limit by IP address (better for public endpoints)
    const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
    identifier = `${config.keyPrefix}:ip:${ipAddress}`;
  }

  // Step 2: Check if user is blocked (from previous violations)
  const blocked = await isIdentifierBlocked(identifier);

  if (blocked) {
    const remainingBlockTime = await getBlockTimeRemaining(identifier);
    const minutesRemaining = Math.ceil(remainingBlockTime / 60);

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Too many attempts. Please try again in ${minutesRemaining} minute${
        minutesRemaining > 1 ? "s" : ""
      }.`,
    });
  }

  // Step 3: Check rate limit
  const rateLimitResult = config.useSlidingWindow
    ? await checkSlidingWindowRateLimit(identifier, config)
    : await checkFixedWindowRateLimit(identifier, config);

  // Step 4: Add rate limit info to response headers
  // These headers tell the client about their rate limit status
  ctx.res.setHeader("X-RateLimit-Limit", rateLimitResult.limit.toString());
  ctx.res.setHeader(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString()
  );
  ctx.res.setHeader("X-RateLimit-Reset", rateLimitResult.resetAt.toISOString());

  // Step 5: If limit exceeded, optionally block user
  if (!rateLimitResult.allowed) {
    // Block user for specified duration (if configured)
    if (config.blockDurationSeconds) {
      await blockIdentifier(identifier, config.blockDurationSeconds);

      const minutesBlocked = Math.ceil(config.blockDurationSeconds / 60);
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Too many attempts. You have been temporarily blocked for ${minutesBlocked} minutes.`,
      });
    }

    // Or just reject this request without blocking
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many attempts. Please try again later.",
    });
  }
}
