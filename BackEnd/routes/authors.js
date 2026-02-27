const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllAuthors,
  getAuthor,
  newAuthor,
  upgradeToAuthor,
} = require("../controllers/authors");

router.route("/").get(getAllAuthors).post(auth, newAuthor);
router.route("/upgrade/:id").post(auth, upgradeToAuthor);
router.route("/:id").get(getAuthor);

module.exports = router;
