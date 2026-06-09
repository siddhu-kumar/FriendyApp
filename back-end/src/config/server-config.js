import dotenv from "dotenv";

dotenv.config();

export const FRONTENDRUNNINGPORT = process.env.FRONTEND || "http://localhost:3000";

export const uri = process.env.DATABASE_URI;

export const Redis_URL = process.env.REDIS_URL;

export const allowed_origin = process.env.ORIGIN;

export const PORT = process.env.PORT;
