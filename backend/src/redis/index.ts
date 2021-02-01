import redis from 'redis';

const REDIS_PORT = 6379;
export const client = redis.createClient(REDIS_PORT);
