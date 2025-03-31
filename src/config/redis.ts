import Logger from "../utils/logger";
import Redis from 'ioredis'
import env from "./env";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
});

redis.on("connect", () => Logger.server("✅ Redis Cache connected successfully!"));
redis.on("error", (err: Error) => Logger.server(`Redis error: ${err}`));

export const cacheSet = async (key: string, value: string) => {
  const store = await redis.setex(key, env.REDIS_TIME, JSON.stringify(value))
  Logger.log(store)
}

export const cacheGet = async (key: string) => {
  const result = await redis.get(key);
  return result ? JSON.parse(result) : null;
}

export default redis;