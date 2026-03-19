// user database connection check
import mongoose from "mongoose";

const uri = process.env.DATABASE_URI
const node_env = process.env.NODE_ENV
export const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            autoIndex: true
        });
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
