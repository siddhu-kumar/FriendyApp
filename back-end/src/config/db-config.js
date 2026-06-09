// user database connection check
import mongoose from "mongoose";

import { PORT } from "./index.js";
import { logger } from "./logger-config.js";
export const connectDB = async () => {
  try {
    await mongoose.connect(PORT.uri);
    console.log("MongoDB connected!");
  } catch (error) {
    logger.error("MongoDB connection error", error);
    process.exit(1);
  }
};
