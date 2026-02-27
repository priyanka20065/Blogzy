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
      ref: "UserSetting",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
