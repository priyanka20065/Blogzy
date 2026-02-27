const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authMiddleware = require("../middleware/auth");
const User = require("../models/UserSetting");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE ORDER
 */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {

    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * VERIFY PAYMENT + UPDATE ROLE
 */
router.post("/verify-payment", authMiddleware, async (req, res) => {

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, authorData } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Order verification failed" });
    }



    let updateData = {};
    if (planType === "writer") {
      updateData = {
        role: "author",
        isPremium: true,
        bio: authorData?.bio || "",
        image: authorData?.image || null,
        social: authorData?.social || {}
      };
    } else if (planType === "reader") {
      updateData = { isPremium: true };
    } else {
      // Default fallback if no planType provided (backward compatibility)
      updateData = { role: "author", isPremium: true };
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );



    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (err) {

    res.status(500).json({ success: false });
  }
});

module.exports = router;
