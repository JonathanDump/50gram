import mongoose from "mongoose";
import { Schema } from "mongoose";

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

export default mongoose.model("Chat", ChatSchema);
module.exports = mongoose.model("Chat", ChatSchema);
