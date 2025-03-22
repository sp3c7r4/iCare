import env from "./env";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_USER_PASSWORD,
  {
    dialect: env.DB_DIALECT,
    host: env.DB_HOST,
    logging: false
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};