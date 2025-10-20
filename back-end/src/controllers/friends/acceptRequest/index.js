

import { User, Chat, RequestSchema } from "../../../models/models.js";
import { namespace } from "../../../index.js";
import { generateRoomId } from "../../chat.js";

export const acceptRequest = async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.body;
  // console.log(userId, requestId);
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      id: requestId,
    });
    const roomId = generateRoomId(userData.id, friendData.id);
    const chat = new Chat({
      roomId: roomId,
    });
    const chatData = await chat.save();
    const request = await RequestSchema.findOneAndDelete({
      userId: requestId,
    });
    // console.log(request);
    const f = friendData.friends.push({
      friendId: userData.id,
      chatId: chatData.roomId,
    });
    const u = userData.friends.push({
      friendId: friendData.id,
      chatId: chatData.roomId,
    });
    const updateUser = await userData.save();
    const updateFriend = await friendData.save();
    // console.log(updateUser, updateFriend);
    const friend = await User.findOne(
      {
        "friends.friendId": userId,
      },
      {
        "friends.$": 1,
      }
    );
    // console.log(namespace[userData.id]);
    try {
      namespace[userData.id].addRoom(
        new Room(
          roomId,
          userId,
          userData.endpoint,
          friendData.id,
          friendData.name,
          friendData.endpoint
        )
      );
      // console.log(namespace[userData.id]);
    } catch (err) {
      console.log("Error from Friend", err);
    }
    res.status(201).json({
      message: "friend added",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "request not completed",
    });
  }
};