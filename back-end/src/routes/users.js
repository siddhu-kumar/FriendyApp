import express from "express"
import {
    createUser,
    updateUser,
    loginUser,
    getUser,
    getAllUser,
} from "../controllers/users.js"

import { verifyToken } from "../middleware/authMiddleware.js"
import { createFriend } from "../controllers/friends.js"

const router = express.Router()

router
    .get("/", verifyToken, getUser)
    .post("/login", loginUser)
    .post("/all_user", verifyToken, getAllUser)
    .post("/register", createUser)
    .patch("/update", verifyToken, updateUser)

export const routes = router