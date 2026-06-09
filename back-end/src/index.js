import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db-config.js"; 
import { router as userRouters } from "./routes/users.js";
import { router as userPasswordResetRouters } from "./routes/password_reset.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redis/clusterredis.js";
import { chatNamespaceFun } from "./websocket/chat.js";
import { authToken } from "./middleware/token.js";

import { PORT } from "./config/index.js";

const allowed_origin = process.env.ORIGIN;

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://100.81.81.20:3000',
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
await connectDB();

app.use("/user", userRouters);
app.use("/", userPasswordResetRouters);

const expressServer = app.listen(PORT.PORT);
export let allUsers = {};

export const io = new Server(expressServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://100.81.81.20:3000',
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

const chatNs = io.of("/chatns");

chatNs.use(authToken); 

chatNamespaceFun(chatNs);
