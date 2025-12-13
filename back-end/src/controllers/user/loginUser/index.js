import { RequestSchema, User } from "../../../models/models.js";
import { Namespace } from "../../../class/Namespace.js";
import { namespace } from "../../../websocket/chat.js";
import { allUsers } from "../../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginUser, UserDetails } from "../../../class/userRespectiveData.js";
import { UserSharedData, RequestSchemaUser } from "../../../class/usersSharedData.js";
import { pubClient } from "../../../redis/clusterredis.js";
import JSONTransport from "nodemailer/lib/json-transport/index.js";

const secret_key = process.env.AUTH_SECRET_KEY;

export const loginUser = async (req, res) => {
  console.log("// login user");
  try {
    const { email, user_password } = req.body;
    // console.log(email, user_password)
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
    const passwordMatch = await bcrypt.compare(
      user_password,
      userData.password
    );
    if (!passwordMatch) {
      console.log("Login failed!");
      return res.status(401).json({
        message: "User/Password does not exists!",
      });
    }
    // console.log(email,passwordMatch)
    const { _id, password, friends, ...data } = userData.toObject();
    let imageObj;
    try {
      if (userData.image.data !== null) {
        // console.log("image", user.contentType);
        imageObj = {
          image: userData.image.data.toString("base64"),
          contentType: userData.image.contentType,
        }; // Convert binary to Base64
      } else {
        imageObj = {
          image: null,
          contentType: null,
        };
      }
    } catch (error) {
      console.error("Error - Login - UserImage", error);
    }
    const token = jwt.sign(
      {
        userId: userData.id,
      },
      secret_key,
      {
        expiresIn: "100h",
      }
    );


    //  UserDetails (LogIN user) class instance
    allUsers[userData.id] = new UserDetails(
      userData.id,
      userData.name,
      userData.email,
      userData.contact,
      userData.createdAt,
      imageObj.image,
      imageObj.contentType,
      token
    );

    console.log('login user instance ', allUsers[userData.id])
    // UserDetails (LogIN user) friend class instance & update friend list
    for (let element of userData.friends) {
      const data = await User.findOne({ id: element.friendId });
      allUsers[userData.id].addUserFriend(
        new UserSharedData(
          data.id,
          data.name,
          data.email,
          data.createdAt,
          data.image.data.toString("base64"),
          data.image.contentType
        )
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
    const res4 = await pubClient.call("JSON.DEL",`SENT-${userData.id}`, "$")
    const res5 = await pubClient.call("JSON.DEL",`RECEIVED-${userData.id}`, "$")
    console.log(res4, res5);
    // namespace[userData.id] = new Namespace(
    //   userData.id,
    //   userData.name,
    //   userData.endpoint
    // );
    // console.log("namspace", namespace);
    res.status(200).json({
      data,
      token,
      userObj: allUsers[userData.id],
    });
  } catch (error) {
    console.log("Error - Login - LoginFailed", error);
    res.status(500).json({
      message: "Login Failed",
    });
  }
};