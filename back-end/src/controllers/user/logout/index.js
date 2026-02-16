import { roomIdList, expireRoom } from "../../../websocket/chat.js";
import { pubClient } from "../../../redis/clusterredis.js";


export const logoutUser = async (req,res) => {
  console.log('// logout user')
  const userId = req.userId;
  await expireRoom(roomIdList, userId);

  

  const res1 = await pubClient.call("JSON.DEL",`SENT-${userId}`, `$`)
  const res2 = await pubClient.call("JSON.DEL", `RECEIVED-${userId}`, `$`)
  // console.log(res1, res2)
  return res.status(200).json({logout:"User logged out successfully"})
}
