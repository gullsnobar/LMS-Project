import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";

const PORT = Number(process.env.PORT) || 5000;

// Ensure MongoDB URI is defined
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_API_KEY || "",
  api_secret: process.env.CLOUD_SECRET_KEY || "",
});

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    try {
      await connectDB();
      console.log("Database connected");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      if (process.env.NODE_ENV === "production") {
        console.error("Database connection is required in production");
        process.exit(1);
      } else {
        console.warn("Continuing without database connection (development mode)");
      }
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();
