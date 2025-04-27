import mongoose from "mongoose"

export const requestSchema = new mongoose.Schema({
  userId: {
      type: String,
  },
  name: {
      type: String
  },
  friendId: {
      type: String,
  },
  friendName: {
      type: String
  }
})