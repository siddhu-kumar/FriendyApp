import mongoose from "mongoose";

export const userImage = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    image: {
        data: Buffer,
        contentType: String
    }
},
{timestamps: true})