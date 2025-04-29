import mongoose from "mongoose";
import env from "./env";
import { Sequelize } from "sequelize";
import Logger from "../utils/logger";


export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_USER_PASSWORD,
  {
    dialect: env.DB_DIALECT,
    host: env.DB_HOST,
    logging: false
  }
)

export const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    Logger.log("✅ Relational Database connected successfully!");
  } catch (error) {
    Logger.error(`❌ SQL Database connection error: ${error}`);
  }
};

export const connectNoSQL = async() => {
  try {
    await mongoose.connect(env.MONGO_URI, {});
    Logger.log("✅ NoSQL Database connected successfully!");
  } catch (error) {
    Logger.error(`❌ NoSQL Database connection error: ${error}`);
  }
}