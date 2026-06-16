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

// ── CORS ──────────────────────────────────────────────────────────
// In development: reflect any request origin (works with credentials).
// In production: restrict to ORIGIN env var (comma-separated list).
const isProd = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean),
];

app.use(
  cors({
    origin: isProd
      ? (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
          cb(new Error(`CORS: origin ${origin} not allowed`));
        }
      : true,   // dev: echo back whatever origin the browser sends
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
// Also mount userRouter at /api/v1 so client calls like
// /api/v1/user-dashboard-stats and /api/v1/user-orders resolve correctly
app.use("/api/v1", userRouter);
// Also mount under /api/user for the client's baseURL
app.use("/api/user", paymentRouter);
app.use("/api/user", couponRouter);

/* =======================
   Error Handling Middleware
======================= */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  // Only log actual server errors — suppress expected auth/session 400-401 noise
  if (status >= 500) {
    console.error("Server Error:", err.message);
  }
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use(ErrorMiddleware);

export { app };
