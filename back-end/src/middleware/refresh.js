import jwt from "jsonwebtoken";
import { Models } from "../models/index.js";

import { KEYS, node_env } from "../config/index.js";

export async function referenshTokenValidation(req, res) {
  console.log("// refresh token validation");
  try {
    const refresh = req.cookies.refreshToken;
    if (!refresh) {
      return res.status(401).json({
        message: "No refresh token provided!",
      });
    }
    const refreshToken = await Models.RefreshToken.findOne({ token: refresh });
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token!",
      });
    }

    const decoded = jwt.verify(refresh, KEYS.refresh_secret_key);
    if (decoded.exp < Date.now() / 1000) {
      await Models.RefreshToken.deleteOne({ token: refresh });
      return res.status(401).json({
        message: "Invalid refresh token!",
      });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, KEYS.secret_key, {
      expiresIn: "30s",
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"?true:false, 
      sameSite: node_env === "production"? "none" : "lax",
      maxAge: 30 * 1000 
    });
    return res.status(200).json({ token: newAccessToken });
  } catch (err) {
    throw err;
  }
}
