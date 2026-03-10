import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/models.js";

const secret_key = process.env.AUTH_SECRET_KEY;
const refresh_secret_key = process.env.REFRESH_SECRET_KEY;

export async function referenshTokenValidation(req, res) {
  console.log("// refresh token validation");
  try {
    const refresh = req.cookies.refreshToken;
    if (!refresh) {
      return res.status(401).json({
        message: "No refresh token provided!",
      });
    }
    const refreshToken = await RefreshToken.findOne({ token: refresh });
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token!",
      });
    }

    const decoded = jwt.verify(refresh, refresh_secret_key);
    if (decoded.exp < Date.now() / 1000) {
      await RefreshToken.deleteOne({ token: refresh });
      return res.status(401).json({
        message: "Invalid refresh token!",
      });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, secret_key, {
      expiresIn: "30s",
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"?true:false, 
      sameSite: "none",
      maxAge: 30 * 1000 
    });
    return res.status(200).json({ token: newAccessToken });
  } catch (err) {
    throw err;
  }
}
