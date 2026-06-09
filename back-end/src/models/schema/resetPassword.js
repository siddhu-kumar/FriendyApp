import mongoose from "mongoose";

export const resetPassword = new mongoose.Schema({
    sskey: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
},
{timestamps: true})