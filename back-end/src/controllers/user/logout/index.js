import { roomIdList, expireRoom } from "../../../websocket/chat.js";
import { pubClient } from "../../../redis/clusterredis.js";
import { RefreshToken } from "../../../models/models.js";
import { createHmac } from "crypto";
const refresh_secret_key = process.env.REFRESH_SECRET_KEY

const node_env = process.env.NODE_ENV

export const logoutUser = async (req,res) => {
  console.log('// logout user')
  const userId = req.userId;
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;
  console.log(accessToken, refreshToken)
  await expireRoom(roomIdList, userId);

  const hashRereshToken = createHmac("sha256", refresh_secret_key)
    .update(refreshToken)
    .digest("hex");
  const invalidateToken = await RefreshToken.findOne({ tokenHash: hashRereshToken});
  invalidateToken.status = "invalid";
  invalidateToken.expireAt = new Date();
  invalidateToken.parentToken = invalidateToken._id;
  await invalidateToken.save();

  const res1 = await pubClient.call("JSON.DEL",`SENT-${userId}`, `$`)
  const res2 = await pubClient.call("JSON.DEL", `RECEIVED-${userId}`, `$`)
  // console.log(res1, res2)

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"?true:false, 
    sameSite: node_env === "production"? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"?true:false,  
    sameSite: node_env === "production"? "none" : "lax",
    path:"/",
  });

  return res.status(200).json({logout:"User logged out successfully"})
}
