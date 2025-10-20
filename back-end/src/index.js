import express from "express";
import cors from "cors";
import { connectDB } from "./models/db.js";
import { Server, Socket } from "socket.io";
import { routes as userRouters } from "./routes/users.js";
// import { routes as userTempRouters } from "./routes/temproute.js";
// import { routes as friendRouters } from "./routes/friends.js";
import { routes as userPasswordResetRouters } from "./routes/password_reset.js";
import { getEndpoint } from "./controllers/chat.js";
import { Message } from "./class/Message.js";
import { Chat } from "./models/models.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./clusterredis.js";

const allowed_origin = process.env.ORIGIN || "*";
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
await connectDB();

app.get("/token", verifyToken, (req, res) => {
  res.status(200).json({
    message: "message",
  });
});

app.use("/user", userRouters);
app.use("/", userPasswordResetRouters);

const expressServer = app.listen(PORT);

const io = new Server(expressServer, {
  cors: allowed_origin,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true, 
  adapter : createAdapter(pubClient, subClient)
});



export let namespace = {};
export let allUsers = {};

io.of("/chatns").on("connection", async (socket) => {
  try {
    // console.log(socket.id)
    socket.emit("testing", "message check");
    const [namespaceuser, id] = await getEndpoint(socket.handshake.auth.token);
    namespace[id] = namespaceuser;
    // console.log(namespace[id]);
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
      // console.log('roomObj',roomObj.roomId)
      let roomName = roomObj.roomId;
      roomNameList.push(roomName);
      // console.log(roomNameList)
      const rooms = socket.rooms;
      let i = 0;
      rooms.forEach((room) => {
        if (i !== 0) socket.leave(room);
        i++;
      });
      socket.join(roomName);
      const thisRoom = [...socket.rooms][1];
      const thisNs = namespace[id].room.find(
        (currentRoom) => currentRoom.roomId === thisRoom
      );
      const chatMessage = await Chat.findOne({
        roomId: thisRoom,
      });
      // console.log('rrr',thisRoom)
      thisNs.history = [...chatMessage.chat];
      socket.emit(thisRoom, thisNs.history);
      // console.log(thisNs.history)
      // console.log('this is room message',thisRoom, thisNs.history.length)
      // const sockets = await io.of(endpoint).in(roomName).fetchSockets();
      callback({
        message: "ok",
      });
    });
    socket.on("newMessageToRoom", async (messageObj, callback) => {
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];
      // pubClient.publish("chatns-log", JSON.stringify(messageObj));

      // console.log('crr',rooms, currentRoom)
      // console.log('ii',messageObj)
      try {
        const senderRoomObj = namespace[id].room.find(
          (element) => element.roomId === currentRoom
        );
        // console.log('srbj',namespace)
        const messageAdded = new Message(
          messageObj.sender,
          messageObj.receiver,
          messageObj.date,
          messageObj.message
        );

        senderRoomObj.addMessage(messageAdded);
        // const ack = await io.of(senderRoomObj.userEndpoint).to(currentRoom).timeout(10000).emitWithAck('listenMessage', messageObj);
        const ack = await socket.to(currentRoom).timeout(10000).emitWithAck("listenMessage", messageObj);
        // console.log('rrbj',namespace.room.find(ele => messageObj.receiver === ele.userId))
        // console.log('ack',ack)
        // if (ack.length === 1) {
        //   const receiverRoomObj = namespace.room.find(element => element.roomId === currentRoom)
        //   receiverRoomObj.addMessage(messageAdded)
        //   // console.log('ack', ack)
        // } else {
        //   console.log('not received')
        // }
        // console.log('roomId', senderRoomObj.roomId)
        const receiverObj = await Chat.findOne({
          roomId: senderRoomObj.roomId,
        });
        receiverObj.chat.push(messageObj);
        const t = await receiverObj.save();
        // console.log(t)
      } catch (err) {
        // console.error(err);
      }
      callback({
        message: "yes",
      });
    });

    socket.on("disconnect", () => {
      // console.log("disconnected");
      delete namespace[id];
      namespace[id] = "";
    });
  } catch (error) {
    // console.error("666", error);
  }
});
