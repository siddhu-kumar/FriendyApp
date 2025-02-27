import express from "express"
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