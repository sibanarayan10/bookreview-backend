import mongoose, { Schema } from "mongoose";
import { User } from "./User.model.js";
import { Book } from "./Book.model.js";

const RatingSchema = new Schema(
  {
    rating: {
      type: Number,
    },
    ratedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
    },

    ratedOn: {
      type: Schema.Types.ObjectId,
      ref: Book,
    },
  },
  { timestamps: true }
);

RatingSchema.index({ ratedBy: 1, ratedOn: 1 });

export const Rating = mongoose.model("Rating", RatingSchema);
