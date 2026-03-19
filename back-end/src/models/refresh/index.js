import mongoose from "mongoose";

export const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "invalid"],
      default: "active",
    },
    parentToken: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RefreshToken",
      default: null,
    },
  },
  { timestamps: true },
);