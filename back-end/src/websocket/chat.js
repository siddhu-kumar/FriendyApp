import { Chat, User } from "../models/models.js";
import { getEndpoint } from "../controllers/chat.js";
import { Message } from "../class/Message.js";
import { pubClient } from "../redis/clusterredis.js";
export let namespace = {};
// records for specific chat group message exists in redis cache in true/false
export let roomIdList = {};
const roomTimeouts = new Map();
// let arr = []
export const chatNamespaceFun = (io) => {
  io.of("/chatns").on("connection", async (socket) => {
    console.log("// chatns");
    try {
      const [namespaceuser, id] = await getEndpoint(
        socket.handshake.auth.token,
      );

      if (id === 0) {
        socket.emit("friendlist", []);
      } else {
        namespace[id] = namespaceuser;
        roomIdList[id] = new Set();
        socket.emit("friendlist", namespace[id].room);
        if (roomTimeouts.has(id)) {
          clearTimeout(roomTimeouts.get(id));
          console.log("clearTimeout");
          roomTimeouts.delete(id);
        }
      }

      const roomNameList = [];
      socket.on("joinsRoom", async (roomObj, callback) => {
        roomIdList[id].add(roomObj.roomId);
        let roomName = roomObj.roomId;
        roomNameList.push(roomName);
        const rooms = socket.rooms;

        for (const room of rooms) {
          if (room !== socket.id) {
            const lr = await pubClient.srem(`socket:${room}:rooms`, room);
            await socket.leave(room);
          }
        }
        await socket.join(roomName);
        await pubClient.sadd(`socket:${roomName}:rooms`, roomName);
        const thisRoom = [...socket.rooms][1];
        const res5 = await pubClient.call("JSON.GET", `${thisRoom}`, "$");
        if (res5) {
          const res2 = await pubClient.call("JSON.GET", `new${thisRoom}`, "$");
          const parseHistory = JSON.parse(res5)[0];
          const newMessage = res2
            ? parseHistory.concat(JSON.parse(res2)[0])
            : parseHistory;
          socket.emit(thisRoom, newMessage);
        } else {
          // Retrieve chat history of a room from Database with argument roomId
          const chatMessage = await Chat.findOne({
            roomId: thisRoom,
          });
          // get subarray of chat history of length 30
          const limitMessage = chatMessage.chat.slice(
            chatMessage.chat.length - 30,
            chatMessage.chat.length,
          );

          const thisNs = namespace[id].room.find(
            (currentRoom) => currentRoom.roomId === thisRoom,
          );
          thisNs.history = [...limitMessage];

          const res1 = await pubClient.call(
            "JSON.SET",
            `${thisRoom}`,
            "$",
            JSON.stringify(thisNs.history),
          );

          const res2 = await pubClient.call("JSON.GET", `${thisRoom}`, "$");

          socket.emit(thisRoom, thisNs.history);
        }
        callback({
          message: "ok",
        });
      });

      let prevOffset = -1;
      socket.on("message_chunk", async ({ offSet, limit }) => {
        console.log("message chunk");
        const rooms = socket.rooms;
        const currentRoom = [...rooms][1];
        const res1 = await pubClient.call("JSON.GET", `${currentRoom}`, "$");
        offSet = JSON.parse(res1)[0].length;
        // console.log('chunk length',JSON.parse(res1)[0].length)
        const messageChunk = await Chat.findOne({ roomId: currentRoom });
        if (messageChunk.chat.length < offSet || prevOffset === offSet) {
          socket.emit("getNextMessage", []);
          // socket.on('disconnect')
        } else {
          prevOffset = offSet;
          const Messagelength = messageChunk.chat.length;
          const messageLimit = messageChunk.chat.slice(
            Math.max(Messagelength - offSet - limit, 0),
            Messagelength - offSet,
          );
          // console.log(offSet, Math.max(Messagelength - offSet - limit, 0), Messagelength - offSet)
          socket.emit("getNextMessage", messageLimit);
          if (messageLimit.length > 0) {
            const res4 = await pubClient.call(
              "JSON.ARRINSERT",
              `${currentRoom}`,
              "$",
              "0",
              ...messageLimit.map((ele) => JSON.stringify(ele)),
            );
            // console.log("res1", res4);
          }
        }
      });

      socket.on("newMessageToRoom", async (messageObj, callback) => {
        const rooms = socket.rooms;
        const currentRoom = [...rooms][1];
        try {
          // console.log("message to room - ", messageObj);
          const senderRoomObj = namespace[id].room.find(
            (element) => element.roomId === currentRoom,
          );
          const messageAdded = new Message(
            messageObj.sender,
            messageObj.receiver,
            messageObj.time,
            messageObj.message,
            senderRoomObj.roomId,
          );
          pubClient
            .publish("chatns", JSON.stringify(messageAdded))
            .then((count) => console.log("Message deliver", count))
            .catch((err) => console.log("msg deliver err", err));
          senderRoomObj.addMessage(messageAdded);

          socket
            .to(senderRoomObj.roomId)
            .timeout(10000)
            .emit("listenMessage", messageObj);
        } catch (err) {
          console.error("room message error", err);
        }
        callback({
          message: "message delivered to server",
        });
      });

      socket.on("disconnect", () => {
        console.log("expire room setTimeout()");
        const timer = setTimeout(() => {
          expireRoom(roomIdList[id], id, 5);
          roomTimeouts.delete(id);
        }, 30000);
        roomTimeouts.set(id, timer);
      });
    } catch (error) {
      console.error("socket connection error", error);
    }
  });
};

export const expireRoom = async (roomIdList, userId, ttl = 0) => {
  console.log("expire room Executing");
  setTimeout(async () => {
    console.log("settimeout");

    const friendlist = await User.findOne({ id: userId });
    console.log(userId, "\n", roomIdList);
    console.log(friendlist.friends);

    for (const friends of friendlist.friends) {
      if (roomIdList[friends.friendId]) {
        console.log(
          roomIdList[friends.friendId],
          " - ",
          roomIdList[friends.friendId].has(friends.chatId),
        );

        if (roomIdList[friends.friendId].has(friends.chatId)) {
          roomIdList[friends.friendId] = null;
          continue;
        }
        const res1 = await pubClient.call("JSON.GET", `${friends.chatId}`);

        const res2 = await pubClient.call("JSON.GET", `new${friends.chatId}`);
        console.log("new chat - ", typeof res2, JSON.parse(res2));
        const receiverObj = await Chat.findOne({
          roomId: friends.chatId,
        });

        const message = JSON.parse(res2) === null ? 0 : JSON.parse(res2);
        for (let i = 0; i < message.length; i++) {
          receiverObj.chat.push(message[i]);
          console.log(message[i]);
        }
        try {
          const t = await receiverObj.save();
        } catch (err) {
          console.log("rece - save", err);
        }

        const expire = await pubClient.expire(friends.chatId, ttl);
        const expire2 = await pubClient.expire(`new${friends.chatId}`, ttl);
        console.log("expire", expire, expire2);
        const exists = await pubClient.exists(friends.chatId);
        const exists2 = await pubClient.exists(`new${friends.chatId}`);

        console.log("exists", exists, exists2);
      }
    }
    console.log("All data stored successfully");
  }, 5000);
};
