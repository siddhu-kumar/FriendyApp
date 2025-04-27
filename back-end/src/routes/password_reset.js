import express from 'express'

import {
    userPasswordReset,
    verifyEmail,
    userOTPVerify
} from '../controllers/password_reset.js'

const router = express.Router()

router
    .post('/verify-email', verifyEmail)
    .post('/verify-otp', userOTPVerify)
    .post('/reset-password', userPasswordReset)

export const routes = router