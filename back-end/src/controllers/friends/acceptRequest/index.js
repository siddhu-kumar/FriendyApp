

import { User, Chat, RequestSchema } from "../../../models/models.js";
import { namespace } from "../../../websocket/chat.js";
import { generateRoomId } from "../../chat.js";
import { Room } from "../../../class/Room.js";
import { pubClient } from "../../../redis/clusterredis.js";

export const acceptRequest = async (req, res) => {
  console.log('// accept request')
  const userId = req.userId;
  const { requestId:friendId } = req.body;
  console.log(userId, friendId);
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      id: friendId,
    });

    // Chat Room & Chat Room Id has been created in DB model "chat"
    const roomId = generateRoomId(userData.id, friendData.id);
    const chat = new Chat({
      roomId: roomId,
    });
    const chatData = await chat.save();
    const request = await RequestSchema.findOneAndDelete({
      friendId: userId
    });
    const u = userData.friends.push({
      friendId: friendData.id,
      chatId: chatData.roomId,
    });
    const f = friendData.friends.push({
      friendId: userData.id,
      chatId: chatData.roomId,
    });

    console.log(u, f)
    await friendData.save();
    await userData.save();
    // Deleting Requests without concern of Data stored in Redis
    const res1 = await pubClient.call("JSON.GET",`RECEIVED-${userId}`, `$`)
    const res2 = await pubClient.call("JSON.GET",`SENT-${friendId}`, `$`)
    console.log('reqAcc/RJSON - del', res1, '\n', res2)

    const res3 = await pubClient.call("JSON.GET",`RECEIVED-${userId}`, `$[?(@.friendId=="${friendId}")]`)
    const res4 = await pubClient.call("JSON.GET",`SENT-${friendId}`, `$[?(@.friendId=="${userId}")]`)
    const res5 = await pubClient.call("JSON.DEL",`RECEIVED-${userId}`, `$[?(@.friendId=="${friendId}")]`)
    const res6 = await pubClient.call("JSON.DEL",`SENT-${friendId}`, `$[?(@.friendId=="${userId}")]`)
    console.log('reqAcc/RJSON - del-1', res3, '\n', res4)

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
    // try {
    //   namespace[userData.id].addRoom(
    //     new Room(
    //       roomId,
    //       userId,
    //       userData.endpoint,
    //       friendData.id,
    //       friendData.name,
    //       friendData.endpoint
    //     )
    //   );
    //   // console.log(namespace[userData.id]);
    // } catch (err) {
    //   console.log("Error from Friend", err);
    // }
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