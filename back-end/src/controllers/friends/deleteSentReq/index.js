import { Models } from "../../../models/index.js";
import { pubClient } from "../../../redis/clusterredis.js";

export const deleteSentRequest = async (req, res) => {
  console.log("// delete sent request");
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const res1 = await pubClient.call("JSON.GET", `SENT-${userId}`, `$`);
    const res2 = await pubClient.call("JSON.GET", `RECEIVED-${friendId}`, `$`);
    console.log(JSON.parse(res1), "\n", JSON.parse(res2));

    if (res1 !== null) {
      const res3 = await pubClient.call(
        "JSON.DEL",
        `SENT-${userId}`,
        `$[?(@.friendId=="${friendId}")]`,
      );
      console.log(" 1-", res3);
    }
    if (res2 !== null) {
      const res3 = await pubClient.call(
        "JSON.DEL",
        `RECEIVED-${friendId}`,
        `$[?(@.friendId=="${userId}")]`,
      );
      console.log(" 2-", res3);
    }
    const deleteSentRequest =
      await Models.CreateFriendRequests.findOneAndDelete({
        userId: userId,
      });
    // console.log("del sent request - ",deleteSentRequest);
    res.status(200).json({
      message: `Request has been deleted.`,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Request could not completed",
    });
  }
};
