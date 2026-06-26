import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testConnection = async () => {
    console.log("Testing MongoDB connection...");
    console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 30) + "...");

    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        });
        console.log("MongoDB connection successful!");
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error);
        process.exit(1);
    }
};

testConnection();
