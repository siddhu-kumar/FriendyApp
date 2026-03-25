import nodemailer from "nodemailer";
import { totp } from "otplib";

import { createUser } from "../user/createUser/index.js";
import { pubClient } from "../../redis/clusterredis.js";

export const userOTPValidate = async (req, res) => {
  try {
    const id = req.query.id;
    console.log('id',id)
    const { otp } = req.body;
    console.log(otp);
    
    const res2 = await pubClient.call("JSON.GET", `TempUser-${id}`, "$");
    const parsedData = JSON.parse(res2);
    
    console.log("validate", parsedData);
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
    await createUser(id, res);

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
  port: 465,
  secure: true,
  auth: {
    user: nodemail_user_id,
    pass: pass_key,
  },
});


export const sendEmail = async (email, otp, tempId) => {
  console.log(email, otp);
  const html = `<html lang="en">
                    <body style="background-color: white;">
                        <h2 style="color: violet">FriendyApp<h2>
                        <span style="color: red;">To unlock your account ${email}</span>
                        <h5 style="color: blueviolet;">Your One time OTP - <h3 style="color: black;">${otp}</h3></h5>
                        
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
