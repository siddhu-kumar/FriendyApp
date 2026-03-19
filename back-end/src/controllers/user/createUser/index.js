import { RefreshToken, TempUser, User } from "../../../models/models.js";
import { generateEndpoint } from "../../chat.js";
import { status } from "../../../utils/error.js";
import { namespace } from "../../../websocket/chat.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Namespace } from "../../../class/Namespace.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promises } from "fs";
import bcrypt from "bcrypt";
import { createHmac } from "crypto";

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

export const createUser = async (otp, res) => {
  console.log("// creating new user");
  try {
    const getUser = await TempUser.findOne({
      otp,
    });

    const { name, email, contact, password } = getUser.toObject();

    const hashedPassword = await bcrypt.hash(password, 10);
    //   console.log("h", hashedPassword);
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
    } catch (error) {
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

    const accessToken = jwt.sign(
      {
        userId: uuid,
      },
      secret_key,
      {
        expiresIn: "30s",
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

    const hashRereshToken = createHmac("sha256", refresh_secrect_key)
      .update(refreshToken)
      .digest("hex");

    const newRefreshToken = new RefreshToken({
      tokenHash: hashRereshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
      parentToken: null,
    });
    const status = await newRefreshToken.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: node_env === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      path:"/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: node_env === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      maxAge: 30 * 1000,
    });
    res.status(status.CREATED).json({
      data,
    });

    await TempUser.findOneAndDelete({
      otp: otp,
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
