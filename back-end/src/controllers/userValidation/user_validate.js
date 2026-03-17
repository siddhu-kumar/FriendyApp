import { TempUser } from "../../models/models.js";
import nodemailer from "nodemailer";
import { createUser } from "../user/createUser/index.js";
import { totp } from "otplib";

export const userOTPValidate = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(otp);
    const validate = await TempUser.findOne({
      otp,
    });
    console.log("validate", validate);
    if (!validate) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }

    const isValid = totp.check(otp, validate.sskey);
    console.log("isVAlid", isValid);
    if (!isValid) {
      console.log(isValid);
      res.status(400).json({
        message: "OTP expired, Retry",
      });
      return;
    }
    await createUser(otp, res);

    // await TempUser.findOneAndDelete({ 'otp': otp })
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Regenerate OTP",
    });
  }
};

const pass_key = process.env.NODEMAIL_PASS_KEY;
const nodemail_user_id = process.env.NODEMAIL_USER_ID;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: nodemail_user_id,
    pass: pass_key,
  },
});

const FRONTENDRUNNINGPORT = process.env.FRONTEND || "http://localhost:3000";

export const sendEmail = async (email, otp) => {
  console.log(email, otp);
  const html = `<html lang="en">
                    <body style="background-color: white;">
                        <h2 style="color: violet">FriendyApp<h2>
                        <span style="color: red;">To unlock your account ${email}</span>
                        <h5 style="color: blueviolet;">Your One time OTP - <h3 style="color: black;">${otp}</h3></h5>
                        <span>Click here <a href="${FRONTENDRUNNINGPORT}/otp-validate">FriendyApp</a> </span>
                        
                    </body>
                </html>`;

  const message = {
    from: "browsers.192@gmail.com",
    to: email,
    sender: "browsers@gmail.com",
    subject: "Hello",
    replyTo: "abc@gmail.com",
    text: `Hello ${email}`,
    html: html,
  };
  const mailsent = await transporter.sendMail(message);
  // console.log(mailsent)
  return mailsent;
};
