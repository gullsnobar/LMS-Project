import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";

const PORT = Number(process.env.PORT) || 5000;

// Debug: log loaded env variables
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 30) + "...");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);

["CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_SECRET_KEY"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Environment variable ${key} is missing`);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_API_KEY || "",
  api_secret: process.env.CLOUD_SECRET_KEY || "",
});

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    if (!app || typeof app.listen !== "function") {
      console.error("app is not a valid Express instance");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Catch unhandled errors globally
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
