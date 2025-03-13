import express from 'express'

import { resetPassword, verifyEmail, verifyOTP } from '../controllers/password_reset.js'

const router = express.Router()

router
    .post('/verify-email',verifyEmail)
    .post('/verify-otp',verifyOTP)
    .post('/reset-password',resetPassword)

export const routes = router