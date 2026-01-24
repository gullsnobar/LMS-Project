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

// Validate MongoDB connection string
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  console.log("Please check your .env file");
  process.exit(1);
}

// Check if it's an SRV connection string and suggest alternatives
const mongoUri = process.env.MONGO_URI;
if (mongoUri.includes('mongodb+srv://')) {
  console.log("ℹUsing SRV connection string for MongoDB Atlas");
  
  // You might want to try the non-SRV version if SRV fails
  console.log("💡 If connection fails, try using non-SRV connection string from MongoDB Atlas:");
  console.log("   - Go to Atlas → Connect → Connect your application");
  console.log("   - Choose 'Node.js Driver 5.0 or later'");
  console.log("   - Use the connection string WITHOUT 'mongodb+srv://' prefix");
}

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
      console.error(" app is not a valid Express instance");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error);
    
    // Provide specific guidance for MongoDB connection errors
    if (error instanceof Error && error.message.includes('MongoDB')) {
      console.log("\n MongoDB Connection Troubleshooting:");
      console.log("1. Check your internet connection");
      console.log("2. Verify your IP is whitelisted in MongoDB Atlas");
      console.log("3. Try using Google DNS (8.8.8.8 and 8.8.4.4)");
      console.log("4. If using SRV string, try non-SRV connection string");
      console.log("5. Check if MongoDB Atlas cluster is running");
    }
    
    // Exit with error code
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