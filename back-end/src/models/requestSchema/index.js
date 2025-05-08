import mongoose from "mongoose"

export const requestSchema = new mongoose.Schema({
  userId: {
      type: String,
  },
  name: {
      type: String
  },
  userImage: {
    data: Buffer,
    contentType: String
  },
  friendId: {
      type: String,
  },
  friendName: {
      type: String
  },
  friendImage: {
    data: Buffer,
    contentType: String
  },
},
{timestamps: true}
);