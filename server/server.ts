import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";

const PORT = Number(process.env.PORT) || 5000;

// Validate MongoDB connection string
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_API_KEY || "",
  api_secret: process.env.CLOUD_SECRET_KEY || "",
});

const startServer = async () => {
  try {
    // Try to connect to database
    try {
      await connectDB();
      console.log("Database connected");
    } catch (dbError) {
      if (process.env.NODE_ENV === 'production') {
        console.error("Database connection required in production");
        process.exit(1);
      }
      // In development, continue without database
      // console.log("Running without database connection");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Catch unhandled errors globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  console.log("Shutting down server...");
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();