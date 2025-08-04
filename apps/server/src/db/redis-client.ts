import { logger } from 'better-auth';
import { createClient, type RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisClient.on('connect', () => {
  logger.info(`Redis connected on ${process.env.REDIS_URL}`);
});

await redisClient.connect();
