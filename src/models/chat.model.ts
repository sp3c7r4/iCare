import { model, Schema } from "mongoose";
import { getFormattedDate } from "../utils/utility";

const chatSchema = new Schema(
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

const Chats = model("Chats", chatSchema);

export default Chats;