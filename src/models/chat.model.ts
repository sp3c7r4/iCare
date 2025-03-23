import { model, Schema } from "mongoose";
import { ulid } from "ulid";

const chatSchema = new Schema(
  {
    _id: { type: String, default: ulid },
    user_id: { type: String, required: true },
    history: [
      {
        user: { type: String, required: true },
        model: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chats = model("Chats", chatSchema);

export default Chats;