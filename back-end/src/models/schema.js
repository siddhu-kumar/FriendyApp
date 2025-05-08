import mongoose, {mongo } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

import { chatSchemas } from "./chatSchema/index.js"
import { requestSchema } from "./requestSchema/index.js"
import { resetPassword } from "./resetPassword/index.js"
import { tempUserSchemas } from "./tempUserSchema/index.js"
import { userImage } from "./userImage/index.js"
import { userSchemas } from "./userSchema/index.js"


export const chatSchema = chatSchemas
export const userSchema = userSchemas
export const resetPasswordSchema = resetPassword
export const requestSchemas = requestSchema
export const tempUserSchema = tempUserSchemas
export const userImageSchema = userImage
