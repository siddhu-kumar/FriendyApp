import express from "express";

import {
  userPasswordReset,
  verifyEmail,
  userOTPVerify,
} from "../controllers/userValidation/password_reset.js";
import { referenshTokenValidation } from "../middleware/refresh.js";

export const router = express.Router();

router
  .post("/verify-email", verifyEmail)
  .post("/verify-otp", userOTPVerify)
  .post("/reset-password", userPasswordReset)
  .post("/refresh-token", referenshTokenValidation);