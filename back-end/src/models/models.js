import mongoose from "mongoose";
import * as Schema from "./schema.js";

// models
export const User = mongoose.model('User', Schema.userSchemas);
export const Chat = mongoose.model('Chat', Schema.chatSchemas)
export const ResetPassword = mongoose.model('ResetPwd', Schema.resetPassword)
export const CreateFriendRequests = mongoose.model('RequestUser', Schema.requestSchema)
export const TempUser = mongoose.model('TempUserData', Schema.tempUserSchemas)
export const RefreshToken = mongoose.model('RefreshToken', Schema.refreshTokenSchema)