import baseRepository from "./baseRepositoryNoSQL";
import Chats from "../models/chat.model";
import CustomError from "../utils/error";
import HttpStatus from "../utils/http";
import logTracker from "../utils/logTracker";
import errorHelper from "../utils/errorHelper";

export default class ChatRepository {

  static getModelInstance() {
    return new baseRepository(Chats);
  }

  static async readAllChats(): Promise<object[]> {
    const baseRepository = this.getModelInstance()
    return await baseRepository.readAll()
  }

  static async createChat(user_id: string, user: string, ai: string): Promise<object> {
    try {
      return await Chats.updateOne(
        { user_id },
        {
          $push: {
            history: {
              user: user,
              model: ai,
              timestamp: new Date(),
            },
          },
        }, { upsert: true }
    )} catch (err) {
      logTracker.log( 'info', JSON.stringify(errorHelper.returnErrorLog(err)) );
      throw new CustomError(
        err instanceof Error ? err.message : "Unknown Error Provided",
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status
      );
    }
}
}