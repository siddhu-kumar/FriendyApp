

import { User, RequestSchema } from "../../../models/models.js";
<<<<<<< HEAD
import nodemailer from "nodemailer"
import fs from "node:fs/promises"
import path from "path"
import { fileURLToPath } from "node:url"
=======
import { allUsers } from "../../../index.js";
import { UserSharedData } from "../../../class/usersSharedData.js";
>>>>>>> 84408644e3c9dfd747a837614043f05f339625bc

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { email } = req.body;
  const userId = req.userId;
  console.log(userId, email)
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
        contentType: userData.image.contentType
      },
      friendId: friendData.id,
      friendName: friendData.name,
      friendImage: {
        data: friendData.image.data,
        contentType: friendData.image.contentType,
      }
    });
<<<<<<< HEAD
    console.log('r',request);
    console.log('u', userData, friendData);
    // allUsers[userId].sentRequestList.push(new UserSharedData(friendData.id, friendData.name, friendData.email, friendData.createdAt));
    // console.log("Request made",allUsers[userId].sentRequestList);
    const r = await request.save();
=======
    allUsers[userId].sentRequestList.push(new UserSharedData(friendData.id, friendData.name, friendData.email, friendData.createdAt));
    console.log("Request made",allUsers[userId].sentRequestList);
    const r = await request.save();
    console.log('r',request, r);
>>>>>>> 84408644e3c9dfd747a837614043f05f339625bc
    res.status(200).json({
      message: `Request has been sent to`,
    });
    sendEmail(friendData.email)
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error on saving data",
    });
  }
};

<<<<<<< HEAD
const pass_key = process.env.NODEMAIL_PASS_KEY
const nodemail_user_id = process.env.NODEMAIL_USER_ID

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: nodemail_user_id,
        pass: pass_key
    },
});

const FRONTENDRUNNINGPORT = process.env.FRONTEND || "http://localhost:3000"


=======
>>>>>>> 84408644e3c9dfd747a837614043f05f339625bc
const sendEmail = async (email) => {
    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const filepath = path.join(__dirname, './Email.html')
        const htmlContent = await fs.readFile(filepath, "utf-8")

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
        }
        const mailsent = await transporter.sendMail(message);
        console.log(mailsent)
        return mailsent;
    } catch (error) {
        console.error(error)
    }
}