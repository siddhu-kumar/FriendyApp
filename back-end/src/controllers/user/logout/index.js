import { roomIdList, expireRoom } from "../../../websocket/chat.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { RefreshToken } from "../../../models/models.js";

const node_env = process.env.NODE_ENV;

export const logoutUser = async (req,res) => {
  console.log('// logout user')
  const userId = req.userId;
  await expireRoom(roomIdList, userId);

  const deleteToken = await RefreshToken.deleteOne({userId: userId});

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
