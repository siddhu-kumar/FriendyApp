import { User, RequestSchema } from "../../../models/models.js";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import { pubClient } from "../../../redis/clusterredis.js";
import { RequestSchemaUser } from "../../../class/usersSharedData.js";

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { requestsId } = req.body;
  const userId = req.userId;
  console.log(userId, requestsId);
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      id: requestsId,
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

    const sentReqObj = {
      userId:userId,
      username:userData.name,
      friendId:friendData.id,
      friendname:friendData.name,
      friendImage:friendData.image.data ? friendData.image.data.toString("base64") : null,
      contentType:friendData.image.contentType ? friendData.image.contentType : null,
      createdAt:request.createdAt,
    }
    const ReceivedReqObj ={
      userId:friendData.id,
      username:friendData.name,
      friendId:userId,
      friendname:userData.name,
      friendImage:userData.image.data ? userData.image.data.toString("base64") : null,
      contentType:userData.image.contentType ? userData.image.contentType : null,
      createdAt:request.createdAt,
  };
    const res1 = await pubClient.call("JSON.GET", `SENT-${userId}`, "$");
    const res2 = await pubClient.call("JSON.GET", `RECEIVED-${friendData.id}`, "$");
    console.log("res1", res1, res2);


    if (res1!==null ) {
      const res3 = await pubClient.call(
        "JSON.ARRAPPEND",
        `SENT-${userId}`,
        "$",
        JSON.stringify(sentReqObj),
      );
      console.log("send req append - ", res3);
    } else {
      const res3 = await pubClient.call(
        "JSON.SET",
        `SENT-${userId}`,
        "$",
        JSON.stringify(sentReqObj),
      );
      console.log("send req add - ", res3);
    }
    
    if(res2!==null ) {
      const res3 = await pubClient.call(
        "JSON.ARRAPPEND",
        `RECEIVED-${friendData.id}`,
        "$",
        JSON.stringify(ReceivedReqObj),
      );
      console.log("received req append - ", res3);
    } else {
        const res3 = await pubClient.call(
        "JSON.SET",
        `RECEIVED-${friendData.id}`,
        "$",
        JSON.stringify(ReceivedReqObj),
      );
      console.log("received req add - ", res3);
    }

    const res4 = await pubClient.call("JSON.GET", `SENT-${userId}`, "$");
    const res5 = await pubClient.call("JSON.GET", `RECEIVED-${friendData.id}`, "$");
    console.log("check", JSON.parse(res4))
    console.log("and", JSON.parse(res5))
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
