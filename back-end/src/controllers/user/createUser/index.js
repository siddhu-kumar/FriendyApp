import jwt from "jsonwebtoken";
import path from "node:path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import { promises } from "fs";
import { v4 as uuidv4 } from "uuid";

import { status } from "../../../utils/error.js";
import { namespace } from "../../../websocket/chat.js";
import { Namespace } from "../../../class/Namespace.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { RefreshToken, User } from "../../../models/models.js";

const secret_key = process.env.AUTH_SECRET_KEY;
const refresh_secrect_key = process.env.REFRESH_SECRET_KEY;
const node_env = process.env.NODE_ENV;

const readFile = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filepath = path.join(__dirname, "./logo192.png");
  const fileTxt = await promises.readFile(filepath, "utf-8");
  return fileTxt;
};

const generateEndpoint = async (inputString) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashKey = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashKey;
};

export const createUser = async (tempId, res) => {
  console.log("// creating new user");
  try {

    const res2 = await pubClient.call("JSON.GET", `TempUser-${tempId}`, "$");
    const parsedData = JSON.parse(res2);
    const name = parsedData[0].name;
    const email = parsedData[0].email;
    const contact = parsedData[0].email;
    const password = parsedData[0].password;

    // const { name, email, contact, password } = getUser.toObject();
    const hashedPassword = await bcrypt.hash(password, 10);
    const endPoint = await generateEndpoint(contact);
    const uuid = uuidv4();
    try {
      const newUser = new User({
        id: uuid,
        name: name,
        email: email,
        contact: contact,
        endpoint: endPoint,
        password: hashedPassword,
      });
      const saveUser = await newUser.save();
      //   console.log(saveUser);

    const expire = await pubClient.expire(`TempUser-${tempId}`, 0);
    console.log(expire)

    } catch (error) {
      console.log("ct", error);
      if (error.code === 11000) {
        if (error.keyValue.email) {
          console.log("Email already exists");
          res.status(400).json({
            message: error.keyValue.email,
            isValid: false,
            object: "mail",
          });
          return;
        }
        if (error.keyValue.contact) {
          console.log("Contact already exists");
          res.status(400).json({
            message: error.keyValue.contact,
            isValid: false,
            object: "contact",
          });
          return;
        }
      }
    }
    namespace[uuid] = new Namespace(uuid, name, endPoint);

    const token = jwt.sign(
      {
        userId: uuid,
      },
      secret_key,
      {
        expiresIn: "100h",
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: uuid,
      },
      refresh_secrect_key,
      {
        expiresIn: "7d",
      },
    );

    const newRefreshToken = new RefreshToken({
      userId: uuid,
      token: refreshToken,
    });

    await newRefreshToken.save();

    const data = {
      name,
      email,
      contact,
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: node_env === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      path: "/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: node_env === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      maxAge: 30 * 60 * 1000,
    });
    res.status(status.CREATED).json({
      data,
    });

  } catch (error) {
    console.log("c", error);
    if (error.code === 11000) {
      // Extract the field that caused the duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateField];
      console.log(
        `Duplicate key error on field: ${duplicateField} with value: ${duplicateValue}`,
      );
    }
    if (error.code === 11000) {
      if (error.keyValue.email) {
        console.log("Email already exists");
        return res.status(400).json({
          message: `Email already exists: ${error.keyValue.email}`,
        });
      }
      if (error.keyValue.contact) {
        console.log("Contact already exists");
        return res.status(400).json({
          message: `Contact already exists: ${error.keyValue.contact}`,
        });
      }
    }
    res.status(500).json({
      message: "Sorry it's us!!",
    });
  }
};
