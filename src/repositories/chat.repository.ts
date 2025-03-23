import baseRepository from "./baseRepositoryNoSQL";
import Chats from "../models/chat.model";

export default class ChatRepository {

  static getModelInstance() {
    return new baseRepository(Chats);
  }

  static async readAllChats(): Promise<object[]> {
    const baseRepository = this.getModelInstance()
    return await baseRepository.readAll()
  }
}