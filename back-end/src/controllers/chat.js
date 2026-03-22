import { Namespace } from "../class/Namespace.js";
import { Room } from "../class/Room.js";
import { Chat, User } from "../models/models.js";
import { pubClient } from "../redis/clusterredis.js";

export const generateRoomId = (user1, user2) => {
  const roomString = `roomId-${user1.slice(0, user1.length / 2)}-${user2.slice(0, user2.length / 2)}`;
  return roomString;
};


export const getEndpoint = async (userId) => {
  console.log("// get Endpoint");
  const namespace = {};
  const user = await User.findOne({
    id: userId,
  });
  const friendList = user.friends;

  if (friendList.length !== 0) {
    namespace[user.id] = new Namespace(user.id, user.name, user.endpoint);
    for (let element of friendList) {
      // console.log(element.friendId)
      const friendData = await User.findOne({
        id: element.friendId,
      });
      if (friendData !== null) {
        let image = "";
        let contentType = "";
        if (friendData.image.data) {
          image = friendData.image.data.toString("base64"); // Convert binary to Base64
          contentType = friendData.image.contentType;
        } else {
          image = "";
        }
        const lastMessage = await Chat.findOne({
          roomId: element.chatId,
        });
        // If there is new message in chat gruop, check in cache memrory
        const res1 = await pubClient.call("JSON.GET", `new${element.chatId}`);
        const msg = res1
          ? JSON.parse(res1)[JSON.parse(res1).length - 1]
          : lastMessage.chat.length !== 0
            ? lastMessage.chat[lastMessage.chat.length - 1]
            : {
                message: "No message sent",
              };
        // console.log(image, contentType)
        const roomObj = new Room(
          element.chatId,
          user.id,
          user.endpoint,
          friendData.id,
          friendData.name,
          image,
          contentType,
          friendData.endpoint,
          msg,
          0,
        );
        // console.log(roomObj)
        namespace[user.id].addRoom(roomObj);
        // console.log('display room -',)
      }
    }
    return [namespace[user.id], user.id];
  } else {
    return ["No Friend", 0];
  }
};