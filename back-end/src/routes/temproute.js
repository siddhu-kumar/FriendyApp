import express from "express"
import multer from "multer"
import { createUserTemp } from "../controllers/user/createUser/index.js"
import { verifyToken } from "../middleware/authMiddleware.js"

import { getAllUser } from "../controllers/user/getAllUser/index.js"
import { validateUserData } from "../controllers/user/validateUserData/index.js"
import { getUser } from "../controllers/user/getUser/index.js"
import { loginUser } from "../controllers/user/loginUser/index.js"
import { updateProfile, updateUser } from "../controllers/user/updateProfile/index.js"
import { createRequest } from "../controllers/friends/createFriendReq/index.js"
import { acceptRequest } from "../controllers/friends/acceptRequest/index.js"
import { getSentRequest } from "../controllers/friends/getPendingReq/index.js"
import { getReceivedRequest } from "../controllers/friends/getReceivedReq/index.js"
import { deleteReceivedRequest } from "../controllers/friends/deletePendingReq/index.js"
import { deleteSentRequest } from "../controllers/friends/deletePendingReq/index.js"

import {
  userOTPValidate
} from "../controllers/user_validate.js"


const router = express.Router()
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage
})
router
    .get("/", verifyToken, getUser)
    .post("/login", loginUser)
    .get("/all_user", verifyToken, getAllUser)
    .post("/register/temp", createUserTemp)
    .post("/validate_data", validateUserData)
    .post("/validate_otp", userOTPValidate)
    .patch("/update", verifyToken, updateUser)
    .patch("/profile", verifyToken, upload.single('imageFile'), updateProfile)
    .post("/create_request", verifyToken, createRequest)
    .get('/pending_request', verifyToken, getSentRequest)
    .get('/received_request', verifyToken, getReceivedRequest)
    .post('/accept_request', verifyToken, acceptRequest)
    .delete('/delete/received_request', verifyToken, deleteReceivedRequest)
    .delete('/delete/sent_request', verifyToken, deleteSentRequest)

export const routes = router