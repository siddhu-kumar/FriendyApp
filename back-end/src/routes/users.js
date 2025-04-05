import express from "express"
import {
    createUser,
    updateUser,
    loginUser,
    getUser,
    getAllUser,
    validateUserData,
    updateProfile,
} from "../controllers/users.js"

import multer from "multer"

import { verifyToken } from "../middleware/authMiddleware.js"
import { acceptRequest, createRequest, deletePendingRequest, getPendingRequest, getReceivedRequest } from "../controllers/friends.js"
import { validateOTP } from "../controllers/user_validate.js"

const router = express.Router()
var storage = multer.memoryStorage()
var upload = multer({storage:storage})
router
    .get("/", verifyToken, getUser)
    .post("/login", loginUser)
    .post("/all_user", verifyToken, getAllUser)
    .post("/register", createUser)
    .post("/validate_data", validateUserData)
    .post("/validate_otp",validateOTP)
    .patch("/update", verifyToken, updateUser)
    .patch("/profile", verifyToken, upload.single('imageFile'), updateProfile)
    .post("/create_request",verifyToken,createRequest)
    .get('/pending_request',verifyToken, getPendingRequest)
    .get('/received_request',verifyToken,getReceivedRequest)
    .post('/accept_request',verifyToken,acceptRequest)
    .delete('/delete_request',verifyToken,deletePendingRequest)

export const routes = router