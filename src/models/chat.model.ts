import { model, Schema } from "mongoose";
import { getFormattedDate } from "../utils/utility";

const chatSchema = new Schema(
  {
    user_id: { type: String, required: true },
    history: [
      {
        user: { type: String, required: true },
        model: { type: String, required: true },
        timestamp: { type: Date, default: () => getFormattedDate()},
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chats = model("Chats", chatSchema);

export default Chats;