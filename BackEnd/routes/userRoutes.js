const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { toggleBookmark, getBookmarks, toggleFollow, getFollowing } = require("../controllers/userController");

router.post("/bookmark/:id", auth, toggleBookmark);
router.get("/bookmarks", auth, getBookmarks);

router.post("/follow/:id", auth, toggleFollow);
router.get("/following", auth, getFollowing);

module.exports = router;
