const express = require("express");
const router = express.Router();
const { auth, requireWriter, requirePremium } = require("../middleware/auth");
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
  addComment,
} = require("../controllers/blogs");


// All logged-in users can create blogs (authors: public, normal users: private)
router.route("/").get(getAllBlogs).post(auth, upload.single("image"), createBlog);

// Get all blogs created by the current user (public and private)
const { getMyBlogs } = require("../controllers/blogs");
router.get("/my", auth, getMyBlogs);


// Add comment to a blog (premium or author only)
router.post("/:id/comment", auth, requirePremium, addComment);

router.route("/:id").get(getBlog).delete(auth, deleteBlog).patch(auth, updateBlog);

module.exports = router;
