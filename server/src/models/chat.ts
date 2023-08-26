import mongoose from "mongoose";
import { Schema } from "mongoose";

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Chat", ChatSchema);
