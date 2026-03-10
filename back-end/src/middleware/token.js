// token validation for socket connection
import jwt from "jsonwebtoken";
import cookie from "cookie";

const secret_key = process.env.AUTH_SECRET_KEY;

export const authToken = (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      return next(new Error("NO cookies provided"));
    }
    const parsedCookies = cookie.parse(cookies);
    socket.userToken = parsedCookies.accessToken;
    const decodedToken = jwt.decode(socket.userToken);
    if (decodedToken && decodedToken.userId) {
      socket.userId = decodedToken.userId;
    }
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};
