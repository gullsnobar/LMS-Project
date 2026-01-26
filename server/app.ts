import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";

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
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "LMS Backend is running",
  });
});

/* =======================
   API Routes
======================= */
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/orders", orderRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analytics", analyticsRouter);

/* =======================
   Error Handling Middleware
======================= */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use(ErrorMiddleware);

export { app };
