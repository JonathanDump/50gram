import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: Date,
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
