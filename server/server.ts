import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
dotenv.config({ path: "./.env" }); // explicit path 
import { app } from "./app";
import connectDB from "./utils/db";

const PORT = Number(process.env.PORT) || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
