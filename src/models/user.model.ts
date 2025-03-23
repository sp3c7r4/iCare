import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { ulid } from "ulid";

class User extends Model {
  // public id!: string;
  // public firstname!: string;
  // public lastname!: string;
  // public email!: string;
  // public password!: string;
}

User.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => ulid(),
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: "User",
  timestamps: true,
})

await User.sync({});
export default User;