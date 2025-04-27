import mongoose, {mongo } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

import { chatSchemas } from "./chatSchema"
import { requestSchema } from "./requestSchema"
import { resetPassword } from "./resetPassword"
import { tempUserSchemas } from "./tempUserSchema"
import { userImage } from "./userImage"
import { userSchemas } from "./userSchema"

// const resetPassword = new mongoose.Schema({
//     sskey: {
//         type: String,
//         required: true,
//     },
//     otp: {
//         type: String,
//         required: true
//     }
// })

// const requestSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//     },
//     name: {
//         type: String
//     },
//     friendId: {
//         type: String,
//     },
//     friendName: {
//         type: String
//     }
// })

// const chatSchemas = new mongoose.Schema({
//     roomId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     chat: [{
//         message: {
//             type: String,
//             require: true,
//         },
//         sender: {
//             type: String,
//             required: true,
//         },
//         receiver: {
//             type: String,
//             required: true,
//         },
//         time: {
//             type: Date,
//         }

//     }],
// })

// const tempUserSchemas = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     contact: {
//         type: String,
//         required: true,
//     },
//     sskey: {
//         type: String,
//     },
//     otp: {
//         type: String,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true
//     }
// })

// const userSchemas = new mongoose.Schema({
//     id: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     contact: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     endpoint: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     friends: [{
//         friendId: {
//             type: String,
//         },
//         chatId: {
//             type: String,
//         }
//     }]
// })

// const userImage = new mongoose.Schema({
//     id: {
//         type: String,
//         unique: true,
//     },
//     image: {
//         data: Buffer,
//         contentType: String
//     }
// })

export const chatSchema = chatSchemas
export const userSchema = userSchemas
export const resetPasswordSchema = resetPassword
export const requestSchemas = requestSchema
export const tempUserSchema = tempUserSchemas
export const userImageSchema = userImage