import mongoose from "mongoose";
import {
  userSchema,
  chatSchema,
  resetPasswordSchema,
  requestSchemas,
  tempUserSchema,
  userImageSchema,
  requestReceivedSchema,
  requestSentSchema,
} from "./schema.js";

// models
export const User = mongoose.model('User', userSchema);
export const Chat = mongoose.model('Chat', chatSchema)
export const Resetpwd = mongoose.model('ResetPwd', resetPasswordSchema)
export const RequestSchema = mongoose.model('RequestUser', requestSchemas)
export const TempUser = mongoose.model('TempUserData', tempUserSchema)
export const Image = mongoose.model('Image', userImageSchema);
// export const ReceivedRequest = mongoose.model('ReceivedRequest',requestReceivedSchema)
// export const SentRequest = mongoose.model('SentRequest',requestSentSchema)