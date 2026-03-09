import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import paymentRouter, { stripeWebhook } from "./routes/payment.route";
import couponRouter from "./routes/coupon.route";

const app: Application = express();

// Stripe webhook needs raw body — must be before express.json()
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

console.log("Server file started"); 


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
app.use("/api/layout", layoutRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", couponRouter);
// Also mount under /api/user for the client's baseURL
app.use("/api/user", paymentRouter);
app.use("/api/user", couponRouter);

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
