import mongoose, { mongo } from "mongoose";
import { userSchema, chatSchema, resetPasswordSchema, requestSchemas } from "./schema.js";

// models
export const User = mongoose.model('User', userSchema);
export const Chat = mongoose.model('Chat', chatSchema)
export const Resetpwd = mongoose.model('ResetPwd',resetPasswordSchema)
export const RequestSchema = mongoose.model('RequestUser',requestSchemas)