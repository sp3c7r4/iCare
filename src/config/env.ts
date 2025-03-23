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
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string
}

export default env;