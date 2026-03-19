import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/models.js";
import { createHmac } from "crypto";

const secret_key = process.env.AUTH_SECRET_KEY;
const refresh_secret_key = process.env.REFRESH_SECRET_KEY;
const node_env = process.env.NODE_ENV;
const refresh_secrect_key_hash = process.env.REFRESH_SECRET_KEY_HASH;

export async function referenshTokenValidation(req, res) {
  console.log("// refresh token validation");
  try {
    // Get the refresh token from the cookies
    const refresh = req.cookies.refreshToken;
    if (!refresh) {
      return res.status(401).json({
        message: "No refresh token provided!",
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refresh,refresh_secret_key);

    console.log("decoded", decoded);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      secret_key,
      {
        expiresIn: "30s",
      },
    );

    // Generate a new refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      refresh_secret_key,
      {
        expiresIn: "7d",
      },
    );

    // Hash the old refresh token
    const hashRereshToken = createHmac("sha256", refresh_secret_key)
      .update(refresh)
      .digest("hex");

    // Find the old refresh token in the database
    const refreshToken = await RefreshToken.findOne({
      tokenHash: hashRereshToken,
      status: "active",
    });

    // If the refresh token is not found or is invalid, return an error
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token!",
      });
    }

    // Invalidate the old refresh token
    refreshToken.status = "invalid";
    refreshToken.expiresAt = new Date();
    refreshToken.parentToken = refreshToken._id;
    await refreshToken.save();

    // Hash the new refresh token
    const newHashRereshToken = createHmac("sha256", refresh_secret_key)
      .update(newRefreshToken)
      .digest("hex");

    // Store the new refresh token in the database
    const newRefreshTokenDoc = new RefreshToken({
      tokenHash: newHashRereshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      parentToken: refreshToken._id,
    });
    await newRefreshTokenDoc.save();

    // Set the new tokens in the cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      maxAge: 30 * 1000,
    });

    // Set the new refresh token in the cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: node_env === "production" ? "none" : "lax",
      path:"/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send a success response
    res.status(200).json({
      message: "Token refreshed successfully!",
    });
    console.log('Successfull')
  } catch (err) {
    console.error("Error refreshing token:", err);    
  }
}
