import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, default: "" },
    img: { type: Schema.Types.ObjectId, ref: "Image" },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", default: [] }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat", default: [] }],
    googleId: String,
  },
  { collection: "Users" }
);

export default mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema);
