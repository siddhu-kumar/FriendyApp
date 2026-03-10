import express from "express";
import cors from "cors";
import { connectDB } from "./models/db.js";
import { routes as userRouters } from "./routes/users.js";
import { routes as userPasswordResetRouters } from "./routes/password_reset.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redis/clusterredis.js";
import { chatNamespaceFun } from "./websocket/chat.js";
import cookieParser from "cookie-parser";
import { authToken } from "./middleware/token.js";

const allowed_origin = process.env.ORIGIN;
console.log("allowed_origin", allowed_origin);
const PORT = process.env.PORT || 8000;

const app = express();
app.use(
  cors({
    origin: allowed_origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
await connectDB();

app.use("/user", userRouters);
app.use("/", userPasswordResetRouters);

const expressServer = app.listen(PORT);
export let allUsers = {};

export const io = new Server(expressServer, {
  cors: {
    origin: allowed_origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

const chatNs = io.of("/chatns");

chatNs.use(authToken); 

chatNamespaceFun(chatNs);
