import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

class RedisService {
  private redisClient: Redis;

  constructor() {
    // logger.info(`env: ${process.env.REDIS_HOST}`)
    // logger.info(`env: ${process.env.REDIS_PORT}`)
    // logger.info(`env: ${process.env.REDIS_PASSWORD}`)
    // logger.info(`env: ${process.env.REDIS_APP_SERVER_PORT}`)

    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    // Explicitly type the 'err' parameter as Error
    this.redisClient.on('error', (err: Error) => {
      logger.error('Redis error:', err);
    });
  }

  // Create or Update a key-value pair
  public async setKey(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  // Read a value by key
  public async getKey(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  // Delete a key
  public async deleteKey(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  // Get all keys (use with caution in production)
  public async getAllKeys(): Promise<string[]> {
    return await this.redisClient.keys('*');
  }
}

export default RedisService;
