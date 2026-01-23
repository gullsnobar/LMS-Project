import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not defined in .env");

    await mongoose.connect(mongoUri, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
