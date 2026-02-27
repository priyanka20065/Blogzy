const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Author's Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  image: {
    type: String,
    required: [true, "Author's image is required"],
  },
  about: {
    type: String,
    required: [true, "Author's Description is required"],
  },
});
module.exports = mongoose.model("Author", authorSchema);
