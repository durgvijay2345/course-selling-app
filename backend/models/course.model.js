import mongoose from "mongoose";

// Review Schema
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

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Course price is required"],
  },
  image: {
    public_id: {
      type: String,
      required: [true, "Image public_id is required"],
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ADMIN",
    required: true,
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
});

export const Course = mongoose.model("Course", courseSchema);
