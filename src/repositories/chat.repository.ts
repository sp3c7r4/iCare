import BaseRepositoryNoSQL from "./baseRepositoryNoSQL";
import Chats from "../models/chat.model";
import CustomError from "../utils/error";
import HttpStatus from "../utils/http";
import logTracker from "../utils/logTracker";
import errorHelper from "../utils/errorHelper";
import { getFormattedDate } from "../utils/utility";

export default class ChatRepository extends BaseRepositoryNoSQL {
  constructor() {
    super(Chats)
  }

    static async readChatsById(user_id: string): Promise<{user: string, model: string, timestamp: Date}[] | []> {
    const generateChatId = getFormattedDate();
    const chat = await Chats.findOne({ user_id, chat_id:generateChatId });
    return chat ? chat.history.map(({ user, model, timestamp }) => ({ user, model, timestamp })) : [];
  }

    static async createChat(user_id: string, user: string, ai: string): Promise<object> {
    try {
      const generateChatId = getFormattedDate();
      return await Chats.findOneAndUpdate(
        { user_id, chat_id: generateChatId }, { $push: { history: { user: user, model: ai, timestamp: new Date() }},
        }, { upsert: true, returnDocument: "after" }
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