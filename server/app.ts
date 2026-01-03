import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware";
import userRouter from "./routes/user.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

/* =======================
   Health Check Route
======================= */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: " LMS Backend is running",
  });
});

/* =======================
   Routes
======================= */
app.use("/api/users", userRouter);


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(" Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use(ErrorMiddleware);

export { app };
