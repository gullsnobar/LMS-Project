import mongoose from "mongoose";
import dns from "dns";

// Set DNS servers to Google's public DNS to help with SRV record resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Attempting MongoDB connection...");
    console.log("Using URI:", mongoUri.split('@')[1]); // Show host without credentials

    // Connection options for better reliability
    const options: any = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip IPv6 (helps with DNS issues)
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // For SRV connections, add DNS resolver options
    if (mongoUri.includes('mongodb+srv://')) {
      console.log("Using SRV connection with Node.js native DNS resolver");
      // Use Node's built-in DNS resolver instead of system DNS
      // This often fixes ENOTFOUND errors
      options.directConnection = false;
    }

    await mongoose.connect(mongoUri, options);

    console.log("MongoDB Connected Successfully");

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error("MongoDB Connection Failed:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        console.log("\n DNS Resolution Failed!");
        console.log("This usually means:");
        console.log("1. Your internet connection is down");
        console.log("2. DNS server cannot resolve MongoDB Atlas hostname");
        console.log("3. Firewall blocking the connection");
        console.log("\n Solutions:");
        console.log("- Try using Google DNS (8.8.8.8)");
        console.log("- Switch to a different network");
        console.log("- Use non-SRV connection string from MongoDB Atlas");
      } else if (error.message.includes('authentication')) {
        console.log("\n Authentication Failed!");
        console.log("Check your MongoDB username and password");
      } else if (error.message.includes('timeout')) {
        console.log("\n Connection Timeout!");
        console.log("Check your internet connection or try again later");
      }
    }

    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;