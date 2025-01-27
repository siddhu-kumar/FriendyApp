import mongoose from "mongoose";
import { userSchema, chatSchema, resetPasswordSchema } from "./schema.js";

// models
export const User = mongoose.model('User', userSchema);
export const Chat = mongoose.model('Chat', chatSchema)
export const Resetpwd = mongoose.model('ResetPwd',resetPasswordSchema)