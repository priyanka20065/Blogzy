const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    // 👇 AUTHOR FIELDS (SAFE EVEN FOR NORMAL USERS)
    image: { type: String, default: null },
    bio: { type: String, default: "" },

    social: {
      instagram: String,
      twitter: String,
      facebook: String,
    },

    blogsCount: { type: Number, default: 0 },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSetting",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSetting",
      },
    ],
  },
  { timestamps: true }
);

// Check if model exists before compiling
const User = mongoose.models.User || mongoose.models.UserSetting || mongoose.model("UserSetting", UserSchema);
module.exports = User;
