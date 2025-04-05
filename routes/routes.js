// routes/routes.js
const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
