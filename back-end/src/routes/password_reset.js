import express from 'express'

<<<<<<< HEAD
import { resetPassword, validateOTP, verifyEmail } from '../controllers/password_reset.js'
=======
import {
    userPasswordReset,
    verifyEmail,
    userOTPVerify
} from '../controllers/password_reset.js'
import { verifyToken } from '../middleware/authMiddleware.js'
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)

const router = express.Router()

router
    .post('/verify-email',verifyEmail)
    .post('/verify-otp',validateOTP)
    .post('/reset-password',resetPassword)

export const routes = router