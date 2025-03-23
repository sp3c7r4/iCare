import baseRepository from "./baseRepositorySQL";
import User from "../models/user.model";

export default class UserRepository {

  static getModelInstance() {
    return new baseRepository(User)
  }

  static async createUser(data: object): Promise<object> {
    const baseRepository = this.getModelInstance()
    return await baseRepository.create(data)
  }
}