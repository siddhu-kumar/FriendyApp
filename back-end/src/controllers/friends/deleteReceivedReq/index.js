
import { Models } from "../../../models/index.js";
import { pubClient } from "../../../redis/clusterredis.js";

export const deleteReceivedRequest = async (req, res) => {
  console.log('// delete Received Request')
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const res1 = await pubClient.call("JSON.GET", `SENT-${friendId}`, `$`);
    const res2 = await pubClient.call("JSON.GET", `RECEIVED-${userId}`, `$`);
    console.log(res1,'\n', res2)
    if(res2!==null ) {
      const res3 = await pubClient.call("JSON.DEL",`RECEIVED-${userId}`, `$[?(@.friendId=="${friendId}")]`)
      console.log(' 1-', res3)
    }
    if(res1!==null ) {
      const res3 = await pubClient.call("JSON.DEL",`SENT-${friendId}`, `$[?(@.friendId=="${userId}")]`)
      console.log(' 2-', res3)
    }

    const deleteReceivedRequest = await Models.CreateFriendRequests.findOneAndDelete({
      friendId: userId,
    });
    // console.log('del received request',deleteReceivedRequest)
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