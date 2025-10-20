import express from 'express'

<<<<<<< HEAD
=======
<<<<<<< HEAD
import { resetPassword, validateOTP, verifyEmail } from '../controllers/password_reset.js'
=======
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b
import {
    userPasswordReset,
    verifyEmail,
    userOTPVerify
<<<<<<< HEAD
} from '../controllers/userValidation/password_reset.js'
import { verifyToken } from '../middleware/authMiddleware.js'
=======
} from '../controllers/password_reset.js'
import { verifyToken } from '../middleware/authMiddleware.js'
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)
>>>>>>> 0594c758fa5045e0c3891a3144a1c975447a721b

const router = express.Router()

router
    .post('/verify-email', verifyEmail)
    .post('/verify-otp', userOTPVerify)
    .post('/reset-password', userPasswordReset)

export const routes = router