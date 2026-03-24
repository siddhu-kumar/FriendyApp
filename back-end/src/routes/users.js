import multer from "multer";
import express from "express";

import {
  getAllUser,
  createUser,
  pagination,
  newUserRegistration,
  logoutUser,
  getUser,
  loginUser,
  updateProfile,
  updateUser,
} from "../controllers/user/index.js";

import {
  acceptRequest,
  createRequest,
  deleteReceivedRequest,
  deleteSentRequest,
  getSentRequest,
  getReceivedRequest,
} from "../controllers/friends/index.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { userOTPValidate } from "../controllers/userValidation/user_validate.js";

var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
});
export const router = express.Router();

router
  .get("/", verifyToken, getUser)
  .post("/login", loginUser)
  .get("/all_user", verifyToken, getAllUser)
  .post("/register", createUser)
  .post("/validate_data", newUserRegistration)
  .post("/validate_otp", userOTPValidate)
  .patch("/update", verifyToken, updateUser)
  .patch("/profile", verifyToken, upload.single("imageFile"), updateProfile)
  .post("/create_request", verifyToken, createRequest)
  .get("/pending_request", verifyToken, getSentRequest)
  .get("/received_request", verifyToken, getReceivedRequest)
  .post("/accept_request", verifyToken, acceptRequest)
  .delete("/delete/received_request", verifyToken, deleteReceivedRequest)
  .delete("/delete/sent_request", verifyToken, deleteSentRequest)
  .post("/pagination", verifyToken, pagination)
  .post("/logout", verifyToken, logoutUser);