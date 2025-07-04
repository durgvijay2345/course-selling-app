// ✅ reviewSchema ko export karo
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ADMIN",
    required: true,
  },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

export const Course = mongoose.model("Course", courseSchema);