import { model, Schema } from "mongoose";
import { getFormattedDate } from "../utils/utility";
import { metric } from "../utils/metrics";
import Logger from "../utils/logger";

export const chatSchema = new Schema(
  {
    user_id: { type: String, required: true },
    chat_id: {type: String, required: true, default: () => getFormattedDate() },
    history: [
      {
        user: { type: String, required: true },
        model: { type: String, required: true },
        timestamp: { type: Date, default: () => Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/*
  * 2 Event Handlers for Read and Write Operations
*/
chatSchema.post('find' || 'findOne', function() {
  Logger.log("Database Read")
  metric.readFromDB2();
});

chatSchema.post('findOneAndUpdate' , function() {
  Logger.log("Database Writted to")
  metric.writeToDB2();
});

const Chats = model("Chats", chatSchema);
export default Chats;