const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure Multer for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const {
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
} = require("../controllers/blogs");

router.route("/").get(getAllBlogs).post(auth, upload.single("image"), createBlog);

router.route("/:id").get(getBlog).delete(auth, deleteBlog).patch(auth, updateBlog);

module.exports = router;
