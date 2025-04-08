// controllers/otpController.js
const SendEmail = require("../services/service");

let otpStore = {}; // { email: { code: '1234', timestamp: 123456789 } }

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
const OTP_VALIDITY_DURATION = 150000; // 2.5 minutes

// 📤 SEND OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = generateOTP();
  otpStore[email] = {
    code: otp,
    timestamp: Date.now(),
  };

  const result = await SendEmail(email, otp);

  if (result.success) {
    return res.status(200).json({ success: true, message: "OTP sent to email" });
  } else {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: result.message,
    });
  }
};

// ✅ VERIFY OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({ success: false, message: "No OTP found for this email" });
  }

  const isExpired = Date.now() - stored.timestamp > OTP_VALIDITY_DURATION;

  if (isExpired) {
    delete otpStore[email];
    return res.status(410).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (stored.code === otp) {
    delete otpStore[email];
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }
};
