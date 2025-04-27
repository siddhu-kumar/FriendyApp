import mongoose from "mongoose";

export const tempUserSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    sskey: {
        type: String,
    },
    otp: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})