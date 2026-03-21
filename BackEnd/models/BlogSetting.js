const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Blog heading is required"],
      trim: true,
      maxlength: [100, "Heading cannot exceed 100 characters"],
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },

    image: {
      type: String,
      required: [false, "Blog image is required"],
    },

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Visibility: 'public' (everyone) or 'private' (only creator)
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    // Creator of the blog (for private blogs)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
