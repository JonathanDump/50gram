import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
  text: String,
  imageUrl: String,
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: Date,
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
});

export default mongoose.model("Message", MessageSchema);
module.exports = mongoose.model("Message", MessageSchema);
