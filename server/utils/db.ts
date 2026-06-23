import mongoose from "mongoose";
import dns from "dns";

// Removed custom DNS servers to use system default DNS

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const options: any = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
    };

    if (mongoUri.includes('mongodb+srv://')) {
      options.directConnection = false;
    }

    await mongoose.connect(mongoUri, options);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(' MongoDB disconnected');
    });

  } catch (error) {
    // Throw the error for the caller to handle
    throw error;
  }
};

export default connectDB;