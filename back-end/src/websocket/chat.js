import { Chat } from "../models/models.js";
import { getEndpoint } from "../controllers/chat.js";
import { Message } from "../class/Message.js";
import { allUsers } from "../index.js";
import { pubClient, subClient } from "../redis/clusterredis.js";
export let namespace = {};
let cacheHistoryObj = {};

export const chantNamespaceFun = (io) => {
  io.of("/chatns").on("connection", async (socket) => {
    try {
      const [namespaceuser, id] = await getEndpoint(
        socket.handshake.auth.token
      );
      namespace[id] = namespaceuser;
      socket.emit("endpoint", namespace[id].endpoint);
      const endroom = socket.rooms;
      let i = 0;
      endroom.forEach((room) => {
        if (i !== 0) socket.leave(room);
        i++;
      });
      socket.join(namespace[id].endpoint);
      socket.to(namespace[id].endpoint).emit("friendlist", namespace[id].room);

      const roomNameList = [];
      socket.on("joinsRoom", async (roomObj, callback) => {
        let roomName = roomObj.roomId;
        roomNameList.push(roomName);
        const rooms = socket.rooms;
        let i = 0;
        rooms.forEach((room) => {
          if (i !== 0) socket.leave(room);
          i++;
        });
        socket.join(roomName);
        const thisRoom = [...socket.rooms][1];
        if (cacheHistoryObj[roomName]) {
          const res2 = await pubClient.call("JSON.GET", `${thisRoom}`, "$");
          // console.log("res2", JSON.parse(res2));
          const parseHistory = JSON.parse(res2);
          socket.emit(thisRoom, parseHistory[0]);
          // await pubClient.call("JSON.DEL", `${thisRoom}`)
        } else {
          const chatMessage = await Chat.findOne({
            roomId: thisRoom,
          });
          const thisNs = namespace[id].room.find(
            (currentRoom) => currentRoom.roomId === thisRoom
          );
          // console.log(thisRoom, roomName);
          thisNs.history = [...chatMessage.chat];
          // console.log("his", thisNs.history, chatMessage);
          const res1 = await pubClient.call(
            "JSON.SET",
            `${thisRoom}`,
            "$",
            JSON.stringify(thisNs.history)
          );
          // console.log("res1", res1);
          const res2 = await pubClient.call("JSON.GET", `${thisRoom}`, "$");
          // console.log('res3', JSON.parse(res2)[0])
          socket.emit(thisRoom, thisNs.history);
          cacheHistoryObj[roomName] = true;
        }

        callback({
          message: "ok",
        });
      });

      socket.on("newMessageToRoom", async (messageObj, callback) => {
        const rooms = socket.rooms;
        const currentRoom = [...rooms][1];
        try {
          console.log('message to room - ', messageObj)
          const senderRoomObj = namespace[id].room.find(
            (element) => element.roomId === currentRoom
          );
          const messageAdded = new Message(
            messageObj.sender,
            messageObj.receiver,
            messageObj.date,
            messageObj.message,
            senderRoomObj.roomId
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

      socket.on("listenMessageAck", (message) => {
        console.log("message delivered to user end", message);
      });
      socket.on("disconnect", () => {
        // console.log("disconnected");
        delete namespace[id];
        namespace[id] = "";
      });
    } catch (error) {
      console.error("socket connection error", error);
    }
  });
};
