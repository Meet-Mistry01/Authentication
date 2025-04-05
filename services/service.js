const nodemailer = require("nodemailer");

const SendEmail = async (to, otp) => {
  const auth = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "meetmistry2014@gmail.com",
      pass: "pxfdcliiumjslmci",
    },
  });

  const mailOptions = {
    from: "meetmistry2014@gmail.com",
    to: to,
    subject: "Verify Your JobXpert Account",
    text: "Your verification code for JobXpert is: " + otp,
  };
  

  try {
    const info = await auth.sendMail(mailOptions);
    return { success: true, message: "Email Sent Successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email", data: error.message || error };
  }
};

module.exports = SendEmail;