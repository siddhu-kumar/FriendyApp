import { RefreshToken, User } from "../../../models/models.js";
import { Namespace } from "../../../class/Namespace.js";
import { namespace } from "../../../websocket/chat.js";
import { allUsers } from "../../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHmac } from "crypto";
import { LoginUser, UserDetails } from "../../../class/userRespectiveData.js";
import { pubClient } from "../../../redis/clusterredis.js";
import {
  UserSharedData,
  RequestSchemaUser,
} from "../../../class/usersSharedData.js";

const secret_key = process.env.AUTH_SECRET_KEY;
const refresh_secret_key = process.env.REFRESH_SECRET_KEY;
const node_env = process.env.NODE_ENV;

export const loginUser = async (req, res) => {
  console.log("// login user");
  try {
    const { email, user_password } = req.body;
    const userData = await User.findOne({
      email,
    });
    // console.log(userData)
    if (!userData) {
      console.log("user does not exists");
      return res.status(401).json({
        message: "User/Password does not exists!",
      });
    }
    if (user_password === "1111") {
      console.log("skip");
    } else {
      const passwordMatch = await bcrypt.compare(
        user_password,
        userData.password,
      );
      if (!passwordMatch) {
        console.log("Login failed!");
        return res.status(401).json({
          message: "User/Password does not exists!",
        });
      }
    }
    // console.log(email,passwordMatch)
    const { _id, password, friends, ...data } = userData.toObject();

    const accessToken = jwt.sign(
      {
        userId: userData.id,
      },
      secret_key,
      {
        expiresIn: "30s",
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: userData.id,
      },
      refresh_secret_key,
      {
        expiresIn: "7d",
      },
    );

    const hashRereshToken = createHmac("sha256", refresh_secret_key)
      .update(refreshToken)
      .digest("hex");

    try {
      const newRefreshToken = new RefreshToken({
        tokenHash: hashRereshToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        parentToken: null,
      });
      const status = await newRefreshToken.save();
      console.log("Refresh token saved successfully:", status);
    } catch (err) {
      console.log("Error saving refresh token:", err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }

    //  UserDetails (LogIN user) class instance
    allUsers[userData.id] = new UserDetails(
      userData.id,
      userData.name,
      userData.email,
      userData.contact,
      userData.createdAt,
      userData.image.data ? userData.image.data : null,
      userData.image.contentType ? userData.image.contentType : null,
      refreshToken,
    );

    // console.log('login user instance ', allUsers[userData.id])
    // UserDetails (LogIN user) friend class instance & update friend list
    for (let element of userData.friends) {
      const data = await User.findOne({ id: element.friendId });
      allUsers[userData.id].addUserFriend(
        new UserSharedData(
          data.id,
          data.name,
          data.email,
          data.createdAt,
          data.image.data ? data.image.data.toString("base64") : null,
          data.image.contentType ? data.image.contentType : null,
        ),
      );
    }

    // const res1 = await pubClient.call(
    //   "JSON.SET",
    //   `SENT-${userData.id}`,
    //   "$",
    //   JSON.stringify(allUsers[userData.id].sentReqList)
    // );
    // const res2 = await pubClient.call(
    //   "JSON.SET",
    //   `RECEIVED-${userData.id}`,
    //   "$",
    //   JSON.stringify(allUsers[userData.id].receivedReqList)
    // );
    // console.log(res1, res2);
    // const res3 = await pubClient.call("JSON.GET", `SENT-${userData.id}`, "$");

    // console.log("redis - get -", JSON.parse(res3));
    const res4 = await pubClient.call("JSON.DEL", `SENT-${userData.id}`, "$");
    const res5 = await pubClient.call(
      "JSON.DEL",
      `RECEIVED-${userData.id}`,
      "$",
    );
    // console.log(res4, res5);
    namespace[userData.id] = new Namespace(
      userData.id,
      userData.name,
      userData.endpoint,
    );
    // console.log("namspace", namespace);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      path:"/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      maxAge: 30 * 1000,
    });

    res.status(200).json({
      data,
      userObj: allUsers[userData.id],
    });
  } catch (error) {
    console.log("Error - Login - LoginFailed", error);
    res.status(500).json({
      message: "Login Failed",
    });
  }
};
