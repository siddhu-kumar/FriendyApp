import mongoose from "mongoose";

export const requestSent = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    friendId: {
      type: String,
    },
    friendName: {
      type: String,
    },
  },
  { timestamps: true }
);
