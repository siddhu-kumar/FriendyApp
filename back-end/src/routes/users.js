import multer from "multer";
import express from "express";

import { Users } from "../controllers/user/index.js";

import { Friends } from "../controllers/friends/index.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { userOTPValidate } from "../controllers/userValidation/user_validate.js";

var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
});
export const router = express.Router();

router
  .get("/", verifyToken, Users.getUser)
  .post("/login", Users.loginUser)
  .get("/all_user", verifyToken, Users.getAllUser)
  .post("/register", Users.createUser)
  .post("/validate_data", Users.newUserRegistration)
  .post("/validate_otp", userOTPValidate)
  .patch("/update", verifyToken, Users.updateUser)
  .patch("/profile", verifyToken, upload.single("imageFile"), Users.updateProfile)
  .post("/pagination", verifyToken, Users.pagination)
  .post("/logout", verifyToken, Users.logoutUser)
  
  .post("/create_request", verifyToken, Friends.createRequest)
  .get("/pending_request", verifyToken, Friends.getSentRequest)
  .get("/received_request", verifyToken, Friends.getReceivedRequest)
  .post("/accept_request", verifyToken, Friends.acceptRequest)
  .delete("/delete/received_request", verifyToken, Friends.deleteReceivedRequest)
  .delete("/delete/sent_request", verifyToken, Friends.deleteSentRequest)