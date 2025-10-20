import express from "express"
import multer from "multer"
<<<<<<< HEAD
// import { createUserTemp } from "../controllers/user/createUser/index.js"
=======
import { createUserTemp } from "../controllers/user/createUser/index.js"
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b
import { verifyToken } from "../middleware/authMiddleware.js"

import { getAllUser } from "../controllers/user/getAllUser/index.js"
import { validateUserData } from "../controllers/user/validateUserData/index.js"
import { getUser } from "../controllers/user/getUser/index.js"
import { loginUser } from "../controllers/user/loginUser/index.js"
import { updateProfile, updateUser } from "../controllers/user/updateProfile/index.js"
import { createRequest } from "../controllers/friends/createFriendReq/index.js"
import { acceptRequest } from "../controllers/friends/acceptRequest/index.js"
<<<<<<< HEAD
import { getSentRequest } from "../controllers/friends/getPendingReq/index.js"
import { getReceivedRequest } from "../controllers/friends/getReceivedReq/index.js"
import { deleteReceivedRequest } from "../controllers/friends/deletePendingReq/index.js"
import { deleteSentRequest } from "../controllers/friends/deletePendingReq/index.js"

import {
  userOTPValidate
} from "../controllers/userValidation/user_validate.js"
=======
import { getPendingRequest } from "../controllers/friends/getPendingReq/index.js"
import { getReceivedRequest } from "../controllers/friends/getReceivedReq/index.js"
import { deletePendingRequest } from "../controllers/friends/deletePendingReq/index.js"

import {
  userOTPValidate
} from "../controllers/user_validate.js"
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b


const router = express.Router()
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage
})
router
    .get("/", verifyToken, getUser)
    .post("/login", loginUser)
    .get("/all_user", verifyToken, getAllUser)
<<<<<<< HEAD
    // .post("/register/temp", createUserTemp)
=======
    .post("/register/temp", createUserTemp)
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b
    .post("/validate_data", validateUserData)
    .post("/validate_otp", userOTPValidate)
    .patch("/update", verifyToken, updateUser)
    .patch("/profile", verifyToken, upload.single('imageFile'), updateProfile)
    .post("/create_request", verifyToken, createRequest)
<<<<<<< HEAD
    .get('/pending_request', verifyToken, getSentRequest)
    .get('/received_request', verifyToken, getReceivedRequest)
    .post('/accept_request', verifyToken, acceptRequest)
    .delete('/delete/received_request', verifyToken, deleteReceivedRequest)
    .delete('/delete/sent_request', verifyToken, deleteSentRequest)
=======
    .get('/pending_request', verifyToken, getPendingRequest)
    .get('/received_request', verifyToken, getReceivedRequest)
    .post('/accept_request', verifyToken, acceptRequest)
    .delete('/delete_request', verifyToken, deletePendingRequest)
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b

export const routes = router