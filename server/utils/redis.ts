import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Create a safe Redis wrapper that no-ops gracefully when REDIS_URL is absent.
// This prevents null-pointer crashes in controllers that call redis.get / set.
// ---------------------------------------------------------------------------

const createRedisClient = () => {
  if (process.env.REDIS_URL) {
    const client = new Redis(process.env.REDIS_URL);

    client.on('connect', () => console.log('✅ Redis connected'));
    client.on('error', (err: any) => console.error('❌ Redis error:', err.message));

    return client;
  }

  // No REDIS_URL — return a no-op stub so controllers don't crash
  console.warn('⚠️  REDIS_URL not set. Caching disabled — running without Redis.');

  return {
    get: async (_key: string) => null,
    set: async (..._args: any[]) => 'OK',
    del: async (..._args: any[]) => 1,
    on: () => {},
  } as any;
};

export const redis = createRedisClient();
