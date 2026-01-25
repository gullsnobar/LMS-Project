import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null as any;

if (redis) {
    redis.on('connect', () => {
        console.log('✅ Redis connected');
    });

    redis.on('error', (err: any) => {
        console.error('❌ Redis error:', err.message);
    });
}

// Export redis instance as a named export
export { redis };
