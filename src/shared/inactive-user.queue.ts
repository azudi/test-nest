import { Queue } from 'bullmq';
import { redisConnection } from './redis.connection';

export const inactiveUserQueue = new Queue('inactive-users', {
  connection: redisConnection,
});