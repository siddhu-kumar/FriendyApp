
import mongoose from "mongoose"

export const chatSchemas = new mongoose.Schema({
    // room name
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
          type: String,
      }

  }],
},
{timestamps: true})