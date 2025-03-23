import baseRepository from "./baseRepository";
import User from "../models/user.model";

export default class UserRepository {

  static getModelInstance() {
    return new baseRepository(User)
  }

  static async createUser(data: object): Promise<User> {
    console.log(data)
    const baseRepository = this.getModelInstance()
    return await baseRepository.create(data)
  }
}