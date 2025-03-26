import { config } from 'dotenv'
import type { Dialect } from 'sequelize';

config()

const env = {
  DB_USER:  process.env.DB_USER as string,
  DB_USER_PASSWORD:  process.env.DB_USER_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_DIALECT: process.env.DB_DIALECT as Dialect,
  DB_HOST: process.env.DB_HOST as string,
  PORT: Number(process.env.PORT),
  MONGO_URI: process.env.MONGO_URI as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY as string,
  AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY as string,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  REDIS_TIME: Number(process.env.REDIS_TIME)
}

export default env;