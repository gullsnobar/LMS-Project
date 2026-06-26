import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Redis client — supports:
//   REDIS_URL         → standard ioredis connection string (preferred)
//   No URL set        → safe no-op stub so the server never crashes
// ---------------------------------------------------------------------------

const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err: any) => console.error('Redis error (non-fatal):', err.message));

    return client;
  }

  // No Redis URL — return a no-op stub so controllers fall back to DB
  console.warn('REDIS_URL not set — session caching disabled. DB fallback active.');

  return {
    get: async (_key: string) => null,
    set: async (..._args: any[]) => 'OK',
    del: async (..._args: any[]) => 1,
    on: () => {},
  } as any;
};

export const redis = createRedisClient();
