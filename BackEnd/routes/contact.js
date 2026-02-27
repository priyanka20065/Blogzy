const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../controllers/contact");
const auth = require("../middleware/auth");

router.post("/", auth, sendContactEmail);

module.exports = router;