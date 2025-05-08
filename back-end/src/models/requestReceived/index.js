import mongoose from "mongoose";

export const requestReceived = new mongoose.Schema(
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
