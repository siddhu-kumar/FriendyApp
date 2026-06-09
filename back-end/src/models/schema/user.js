import mongoose from "mongoose";

export const userSchemas = new mongoose.Schema({
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
        required: true,
        unique: true,
    },
    image: {
        data:Buffer,
        contentType: String
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        friendId: {
            type: String,
        },
        //room name
        chatId: {
            type: String,
        }
    }]
},
{timestamps: true})