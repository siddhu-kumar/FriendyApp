import { Redis, Cluster } from "ioredis";
import { Chat } from "../models/models.js";
import { cacheHistoryObj } from "../websocket/chat.js";

const Redis_URL = process.env.REDIS_URL;

const pubClient = new Redis(Redis_URL, {
  connectTimeout: 10000,
});

// const pubClient = new Cluster([
//   {
//     host: "127.0.0.1",
//     port: 7000,
//   },
//   {
//     host: "127.0.0.1",
//     port: 7001,
//   },
//   {
//     host: "127.0.0.1",
//     port: 7002,
//   },
// ]);

const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  console.error("Redis PubClient Error:", err);
});

subClient.on("error", (err) => {
  console.error("Redis SubClient Error:", err);
});

subClient
  .subscribe("chatns", (err, count) => {
    if (err) console.error("Subscribe error:", err);
    console.log("Subscribed to chatns, count:", count);
  })
  .then((r) => console.log("res", r))
  .catch((err) => console.log("subscribe err", err));

subClient.on("message", async (channel, message) => {
  // console.log("subscribe cahnnel - ", channel, message);

  const parsedMessage = JSON.parse(message);
  const obj = {
    sender: parsedMessage.sender,
    receiver: parsedMessage.receiver,
    time: new Date(parsedMessage.time),
    message: parsedMessage.message,
    flag:true
  };

  if (cacheHistoryObj[parsedMessage.roomId]) {
    const res2 = await pubClient.call(
      "JSON.GET",
      `new${parsedMessage.roomId}`,
      "$",
    );
    const prevMsg = JSON.parse(res2);
    // console.log("prevMsg", prevMsg);
    const res3 = await pubClient.call(
      "JSON.ARRAPPEND",
      `${parsedMessage.roomId}`,
      "$",
      JSON.stringify(obj),
    );
    console.log("res3 - ", res3);
    const res4 = await pubClient.call(
      "JSON.GET",
      `new${parsedMessage.roomId}`,
      "$",
    );
  }

});

export { pubClient, subClient };
