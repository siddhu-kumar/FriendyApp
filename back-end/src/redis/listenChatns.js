import { Chat } from "../models/models";
import { pubClient } from "./clusterredis";

subClient
  .subscribe("chatns", (err, count) => {
    console.log("check");
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to chatns, count:", count);
    }
  })
  .then((r) => console.log("res".r))
  .catch((err) => console.log("subscribe err", err));

subClient.on("message", async (channel, message) => {
  console.log("subscribe cahnnel - ", channel, message);
  // console.log("message", JSON.parse(message));

  const parsedMessage = JSON.parse(message);
  const obj = {
    sender: parsedMessage.sender,
    receiver: parsedMessage.receiver,
    date: parsedMessage.date,
    message: parsedMessage.message,
  };

  if (cacheHistoryObj[parsedMessage.roomId]) {
    const res2 = await pubClient.call(
      "JSON.GET",
      `${parsedMessage.roomId}`,
      "$"
    );
    const prevMsg = JSON.parse(res2);
    console.log("res2", prevMsg);
    console.log("prevMsg", prevMsg);
    const res3 = await pubClient.call(
      "JSON.ARRAPPEND",
      `${parsedMessage.roomId}`,
      "$",
      JSON.stringify(obj)
    );
    console.log("res3 - ", res3);
    const res4 = await pubClient.call(
      "JSON.GET",
      `${parsedMessage.roomId}`,
      "$"
    );
    console.log("res4", JSON.parse(res4));
  }

  const receiverObj = await Chat.findOne({
    roomId: parsedMessage.roomId,
  });
  receiverObj.chat.push(obj);
  const t = await receiverObj.save();
});
