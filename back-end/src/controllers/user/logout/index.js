import { roomIdList, expireRoom } from "../../../websocket/chat.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { Models } from "../../../models/index.js";

import { node_env } from "../../../config/index.js";

export const logoutUser = async (req,res) => {
  console.log('// logout user')
  const userId = req.userId;
  await expireRoom(roomIdList, userId);

  const deleteToken = await Models.RefreshToken.deleteOne({userId: userId});

  const res1 = await pubClient.call("JSON.DEL",`SENT-${userId}`, `$`)
  const res2 = await pubClient.call("JSON.DEL", `RECEIVED-${userId}`, `$`)
  // console.log(res1, res2)

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: node_env === "production"?true:false, 
    sameSite: node_env === "production"? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: node_env === "production"?true:false,  
    sameSite: node_env === "production"? "none" : "lax",
    path: "/refresh-token",
  });

  return res.status(200).json({logout:"User logged out successfully"})
}
