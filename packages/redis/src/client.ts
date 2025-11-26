import Redis from "ioredis";

// Store the Redis connection globally so we reuse it
let redisConnection: Redis | null = null;

/**
 * Get or create Redis connection
 * This function returns the same connection each time (singleton pattern)
 */
export function getRedisClient(): Redis {
  // If connection already exists, return it
  if (redisConnection) {
    return redisConnection;
  }

  // Create new Redis connection
  redisConnection = new Redis({
    host: process.env.REDIS_HOST || "localhost", // Where Redis is running
    port: parseInt(process.env.REDIS_PORT || "6379"), // Redis default port
    password: process.env.REDIS_PASSWORD, // Optional password

    // If connection fails, retry with increasing delays
    retryStrategy: (times) => {
      const delayInMs = Math.min(times * 50, 2000); // Max 2 second delay
      return delayInMs;
    },

    lazyConnect: true, // Don't connect immediately, wait for .connect() call
  });

  // Log errors
  redisConnection.on("error", (error) => {
    console.error("❌ Redis Connection Error:", error);
  });

  // Log successful connection
  redisConnection.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });

  return redisConnection;
}

/**
 * Connect to Redis when server starts
 */
export async function connectRedis(): Promise<void> {
  const client = getRedisClient();

  // Only connect if not already connected
  if (client.status !== "ready") {
    await client.connect();
  }
}

/**
 * Disconnect from Redis when server shuts down
 */
export async function disconnectRedis(): Promise<void> {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
}
