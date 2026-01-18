import express from "express";
import cors from "cors";
import { connectDB } from "./models/db.js";
import { routes as userRouters } from "./routes/users.js";
import { routes as userPasswordResetRouters } from "./routes/password_reset.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redis/clusterredis.js";
import { chantNamespaceFun } from "./websocket/chat.js";

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
export let allUsers = {};

export const io = new Server(expressServer, {
  cors: allowed_origin,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  adapter: createAdapter(pubClient, subClient),
});

chantNamespaceFun(io);
