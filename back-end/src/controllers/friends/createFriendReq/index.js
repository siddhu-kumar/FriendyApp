import { User, RequestSchema } from "../../../models/models.js";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import { pubClient } from "../../../redis/clusterredis.js";
import { RequestSchemaUser } from "../../../class/usersSharedData.js";

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { email } = req.body;
  const userId = req.userId;
  // console.log(userId, email)
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      email: email,
    });

    const request = new RequestSchema({
      userId: userId,
      name: userData.name,
      userImage: {
        data: userData.image.data,
        contentType: userData.image.contentType,
      },
      friendId: friendData.id,
      friendName: friendData.name,
      friendImage: {
        data: friendData.image.data,
        contentType: friendData.image.contentType,
      },
    });

    const requestObj1 = new RequestSchemaUser(userId, userData.name, friendData.id, friendData.name, friendData.image.data.toString("base64"), friendData.image.contentType, request.createdAt)
    const requestObj2 = new RequestSchemaUser(friendData.id, friendData.name, userId, userData.name, userData.image.data.toString("base64"), userData.image.contentType, request.createdAt)

    const res2 = await pubClient.call("JSON.ARRAPPEND", `SENT-${userId}`, "$", JSON.stringify(requestObj1))
    const res4 = await pubClient.call("JSON.ARRAPPEND", `RECEIVED-${friendData.id}`, "$", JSON.stringify(requestObj2))

    console.log("new friend added - ",res2, res4);
    const res3 = await pubClient.call("JSON.GET", `SENT-${userId}`, "$")
    // console.log(JSON.parse(res3))
    const r = await request.save();
    res.status(200).json({
      message: `Request has been sent to`,
    });
    sendEmail(friendData.email);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error on saving data",
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

const sendEmail = async (email) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filepath = path.join(__dirname, "./Email.html");
    const htmlContent = await fs.readFile(filepath, "utf-8");

    const html = htmlContent
      .replace(/{{email}}/g, email)
      .replace(/{{frontendUrl}}/g, FRONTENDRUNNINGPORT);

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
  } catch (error) {
    console.error(error);
  }
};
