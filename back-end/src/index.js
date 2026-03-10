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
const PORT = process.env.PORT || 8000;

const app = express();

// Explicit CORS handling for Cookies on Render
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowed_origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  
  // Handle Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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
