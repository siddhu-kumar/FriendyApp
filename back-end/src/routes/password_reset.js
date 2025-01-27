import express from 'express'

import { resetPassword, validateOTP, verifyEmail } from '../controllers/password_reset.js'

const router = express.Router()

router
    .post('/verify-email',verifyEmail)
    .post('/verify-otp',validateOTP)
    .post('/reset-password',resetPassword)

export const routes = router