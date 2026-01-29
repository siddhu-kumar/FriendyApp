import { Chat } from "../models/models.js";
import { getEndpoint } from "../controllers/chat.js";
import { Message } from "../class/Message.js";
import { pubClient } from "../redis/clusterredis.js";
export let namespace = {};
// records for specific chat group message exists in redis cache in true/false
export let cacheHistoryObj = {};
let roomIdList = {};
const roomTimeouts = new Map();
// let arr = []
export const chantNamespaceFun = (io) => {
  io.of("/chatns").on("connection", async (socket) => {
    try {
      const [namespaceuser, id] = await getEndpoint(
        socket.handshake.auth.token,
      );
      namespace[id] = namespaceuser;
      roomIdList[id] = new Set();

      socket.emit("friendlist", namespace[id].room);
      
      if (roomTimeouts.has(id)) {
        clearTimeout(roomTimeouts.get(id));
        console.log('clearTimeout')
        roomTimeouts.delete(id)
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
        // console.log(roomName)
        await pubClient.sadd(`socket:${roomName}:rooms`, roomName);
        const thisRoom = [...socket.rooms][1];

        if (cacheHistoryObj[roomName]) {
          const res2 = await pubClient.call("JSON.GET", `${thisRoom}`, "$");
          const parseHistory = JSON.parse(res2);
          socket.emit(thisRoom, parseHistory[0]);
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
          // console.log("res3", JSON.parse(res2)[0]);

          socket.emit(thisRoom, thisNs.history);
          cacheHistoryObj[roomName] = true;
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
              "JSON.ARRAPPEND",
              `${currentRoom}`,
              "$",
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
            messageObj.date,
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
        const timer = setTimeout(() => {
          expireRoom(roomIdList[id], 5);
          roomTimeouts.delete(id);
        }, 30000);
        roomTimeouts.set(id, timer);
        // arr.push(timer)
      });
    } catch (error) {
      console.error("socket connection error", error);
    }
  });
};

const expireRoom = async (roomIdList, ttl = 0) => {
  console.log("expire room");

  for (const roomId of roomIdList) {
    const expire = await pubClient.expire(roomId, ttl);
    console.log("expire", expire);
  }

  setTimeout(async () => {
    for (const roomId of roomIdList) {
      const exists = await pubClient.exists(roomId);
      console.log("exists", exists);
    }
  }, 5000);
};