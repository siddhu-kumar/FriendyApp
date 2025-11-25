import express from "express";
import cors from "cors";
import { connectDB } from "./models/db.js";
import { Server } from "socket.io";
import { routes as userRouters } from "./routes/users.js";
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
  adapter: createAdapter(pubClient, subClient),
});

export let namespace = {};
export let allUsers = {};

io.of("/chatns").on("connection", async (socket) => {
  try {
    const [namespaceuser, id] = await getEndpoint(socket.handshake.auth.token);
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
      const thisNs = namespace[id].room.find(
        (currentRoom) => currentRoom.roomId === thisRoom
      );
      const chatMessage = await Chat.findOne({
        roomId: thisRoom,
      });
      thisNs.history = [...chatMessage.chat];
      socket.emit(thisRoom, thisNs.history);
      callback({
        message: "ok",
      });
    });
    socket.on("newMessageToRoom", async (messageObj, callback) => {
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];
      try {
        const senderRoomObj = namespace[id].room.find(
          (element) => element.roomId === currentRoom
        );
        const messageAdded = new Message(
          messageObj.sender,
          messageObj.receiver,
          messageObj.date,
          messageObj.message
        );
        pubClient.publish("chatns", JSON.stringify(messageObj))
        .then((count => console.log('Message deliver',count)))
        .catch(err => console.log('msg deliver',err));
        
        senderRoomObj.addMessage(messageAdded);
        const receiverObj = await Chat.findOne({
          roomId: senderRoomObj.roomId,
        });
        receiverObj.chat.push(messageObj);
        const t = await receiverObj.save();
        socket.to(senderRoomObj.roomId).timeout(10000).emit("listenMessage", messageObj);
      } catch (err) {
        console.error('room message error',err);
      }
      callback({
        message: "message delivered to server",
      });
    });

    socket.on('listenMessageAck',(message) => {
      console.log('message delivered to user end',message)
    })
    socket.on("disconnect", () => {
      // console.log("disconnected");
      delete namespace[id];
      namespace[id] = "";
    });
  } catch (error) {
    console.error("socket connection error", error);
  }
});

subClient.subscribe("chatns", (err, count) => {
  console.log('check')
   if (err) {
    console.error("Subscribe error:", err);
  } else {
    console.log("Subscribed to chatns, count:", count);
  }
}).then(r => console.log('res'. r)).catch(err => console.log('subscribe err',err));


subClient.on("message", (channel, message) => {
  console.log('subscribe cahnnel - ',channel, message)
  console.log('message',JSON.parse(message))
  const parsedMessage = JSON.parse(message)
  console.log('parsed message', parsedMessage.message)
});