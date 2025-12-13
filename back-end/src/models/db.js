// user database connection check
import mongoose from "mongoose";

const uri = process.env.DATABASE_URI
export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
