import mongoose from "mongoose";
import { Schema } from "mongoose";

const ImageSchema = new Schema({
  name: { type: String, required: true },
  image: { data: Buffer, contentType: String },
});

module.exports = mongoose.model("Image", ImageSchema);
