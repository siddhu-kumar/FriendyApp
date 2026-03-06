import mongoose from "mongoose";

export const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
},
{timestamps: true})

// export const generateHashKey = (userId) => {
//   const timestamp = Date.now().toString();
//   const randomString = Math.random().toString(36).substring(2, 15);
//   const hashKey = [userId, timestamp, randomString]
//     .map((part) => part.toString())
//     .map((byte) => byte.toString(16).padStart(2, "0"))
//     .join("");
//   return hashKey;
// }