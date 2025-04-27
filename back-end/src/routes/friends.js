import express from "express"

import { getFriends } from "../controllers/friends/getFriends/index.js"

import {
    createFriend,
    deleteFriend,
    getFriendById
} from "../controllers/friends.js"

import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router
    .post("/", verifyToken, createFriend)
    .delete("/:id", verifyToken, deleteFriend)
    .get('/', verifyToken, getFriends) // get particular user friend or connections
    .get("/:id", verifyToken, getFriendById) // get single friend

export const routes = router