import mongoose, { Schema } from "mongoose";
import { User } from "./User.model.js";
import { Book } from "./Book.model.js";

const ReviewSchema = new Schema(
  {
    context: {
      type: String,
      required: true,
    }, // Context of the review
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    reviewedOn: {
      type: Schema.Types.ObjectId,
      ref: Book,
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ reviewedBy: 1, reviewedOn: 1 });

export const Review = mongoose.model("Review", ReviewSchema);
