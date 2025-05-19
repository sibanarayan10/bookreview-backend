import mongoose, { Schema } from "mongoose";
import { User } from "./User.model.js";

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

BookSchema.index({ author: 1 }); // Create an index on the author field
BookSchema.index({ title: "text" }); //Create a text index on the title field for partial search
export const Book = mongoose.model("Book", BookSchema);
