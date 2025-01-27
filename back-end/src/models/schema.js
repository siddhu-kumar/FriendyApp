import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

const resetPassword = new mongoose.Schema({
    sskey: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
})

const chatSchemas = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    chat: [{
        message: {
            type: String,
            require: true,
        },
        sender: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
        }

    }],
})

const userSchemas = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    endpoint: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        friendId: {
            type: String,
        },
        chatId: {
            type: String,
        }
    }]
})

export const chatSchema = chatSchemas
export const userSchema = userSchemas
export const resetPasswordSchema = resetPassword