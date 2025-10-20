import { Namespace } from "../class/Namespace.js";
import { Room } from "../class/Room.js";
import { authToken } from "../middleware/token.js";
import { Chat, User } from "../models/models.js";
// import { Image } from "../models/models.js";

export const generateRoomId = (user1, user2) => {
  const roomString = `roomId-${user1.slice(0, user1.length / 2)}-${user2.slice( 0,user2.length / 2)}`;
  return roomString;
};

export const generateEndpoint = async (inputString) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashKey = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashKey;
};

export const getEndpoint = async (token) => {
  const id = authToken(token);
  if (id === null) {
    // console.log("invalid token");
    return [null, null];
  }
  const namespace = {};
  const user = await User.findOne({
    id: id,
  });
  const friendList = user.friends;

  if (friendList.length !== 0) {
    namespace[user.id] = new Namespace(user.id, user.name, user.endpoint);
    for (let element of friendList) {
      // console.log(element.friendId)
      const friendData = await User.findOne({
        id: element.friendId,
      });
      // const findImage = await Image.findOne({
      //   id: element.friendId,
      // });

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
        const msg =
          lastMessage.chat.length !== 0
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
          0
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

export const getFriendList = async (id) => {
  const getFriend = await User.findOne({
    id: id,
  });
  const friendList = getFriend.friends;
  // console.log(friendList)
  const friendData = [];
  for (let element of friendList) {
    const data = await User.findOne({
      id: element.friendId,
    });
    // console.log(data)
    const { id, name, endpoint } = data;
    friendData.push({
      id,
      name,
      endpoint,
    });
  }
  // console.log('right',friendData);
  return friendData;
};
