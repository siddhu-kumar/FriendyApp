import express from "express"

import { getAllUser } from "../controllers/user/getAllUser/index.js"
import { createUser } from "../controllers/user/createUser/index.js"
import { validateUserData } from "../controllers/user/validateUserData/index.js"
import { getUser } from "../controllers/user/getUser/index.js"
import { loginUser } from "../controllers/user/loginUser/index.js"
import { updateProfile, updateUser } from "../controllers/user/updateProfile/index.js"
import { createRequest } from "../controllers/friends/createFriendReq/index.js"
import { acceptRequest } from "../controllers/friends/acceptRequest/index.js"
import { getPendingRequest } from "../controllers/friends/getPendingReq/index.js"
import { getReceivedRequest } from "../controllers/friends/getReceivedReq/index.js"
import { deletePendingRequest } from "../controllers/friends/deletePendingReq/index.js"
import { pagination } from "../controllers/user/pagination/index.js"

import multer from "multer"

import {
    createUser,
    updateUser,
    loginUser,
    getUser,
    getAllUser,
    validateUserData,
} from "../controllers/users.js"

import { verifyToken } from "../middleware/authMiddleware.js"
import { acceptRequest, createFriend, createRequest, deletePendingRequest, getPendingRequest, getReceivedRequest } from "../controllers/friends.js"
import { email_validate } from "../controllers/email_validate.js"

const router = express.Router()

router
    .get("/", verifyToken, getUser)
    .post("/login", loginUser)
    .post("/all_user", verifyToken, getAllUser)
    .post("/register", createUser)
    .post("/validate_data", validateUserData)
    .post("/validate_email",email_validate)
    .patch("/update", verifyToken, updateUser)
    .post("/create_request",verifyToken,createRequest)
    .get('/pending_request',verifyToken, getPendingRequest)
    .get('/received_request',verifyToken,getReceivedRequest)
    .post('/accept_request',verifyToken,acceptRequest)
    .delete('/delete_request',verifyToken,deletePendingRequest)

export const routes = router