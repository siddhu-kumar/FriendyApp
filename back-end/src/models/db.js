import mongoose from "mongoose";

// const uri = "mongodb+srv://siddhu:RPdpXZhacOn9xp0r@cluster0.yl1swhf.mongodb.net/abc?retryWrites=true&w=majority&appName=cluster0"

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