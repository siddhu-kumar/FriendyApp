
import { RequestSchema, User } from "../../../models/models.js";
import { pubClient } from "../../../redis/clusterredis.js";

export const deleteSentRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  console.log("rr", req.body);
  try {
    console.log(userId, friendId)
    const res3 = await pubClient.call("JSON.GET", `SENT-${userId}`, `$[?(@.friendId=="${friendId}")]`);
    const res4 = await pubClient.call("JSON.GET", `RECEIVED-${friendId}`, `$[?@.userId=="${friendId}"]`);
    console.log("del sent req - ", JSON.parse(res3), JSON.parse(res4))
    if(res3) {
      const res2 = await pubClient.call("JSON.DEL",`SENT-${userId}`, `$[?(@.friendId=="${friendId}")]`)
      const res1 = await pubClient.call("JSON.DEL",`RECEIVED-${friendId}`, `$[?(@.userId=="${friendId}")]`)
      console.log("deleted",res2, res1)
    }

    const deleteSentRequest = await RequestSchema.findOneAndDelete({
      userId: userId,
    });
    console.log("del sent request - ",deleteSentRequest);
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


export const deleteReceivedRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId, friendname } = req.body;
  // console.log("rr", req.body);
  try {
    console.log(userId, friendId, friendname)
    const res3 = await pubClient.call("JSON.GET", `SENT-${friendId}`, `$[?(@.userId=="${friendId}")]`);
    const res4 = await pubClient.call("JSON.GET", `RECEIVED-${userId}`, `$[?@.friendId=="${friendId}"]`);
    console.log("del recd req - ", JSON.parse(res3), JSON.parse(res4))
    if(res3) {
      const res2 = await pubClient.call("JSON.DEL",`SENT-${friendId}`, `$[?(@.userId=="${friendId}")]`)
      const res1 = await pubClient.call("JSON.DEL",`RECEIVED-${userId}`, `$[?(@.friendId=="${friendId}")]`)
      console.log("deleted",res2, res1)
    }

    const deleteReceivedRequest = await RequestSchema.findOneAndDelete({
      friendId: userId,
    });
    console.log('del received request',deleteReceivedRequest)
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