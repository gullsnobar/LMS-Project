import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  sendStripePublishableKey,
  newPayment,
  getUserOrders,
  getUserDashboardStats,
} from "../controllers/payment.controller";

const paymentRouter = express.Router();

paymentRouter.get(
  "/payment/stripePublishAbleKey",
  sendStripePublishableKey
);

paymentRouter.post(
  "/payment/process",
  isAuthenticated,
  newPayment
);

paymentRouter.get(
  "/user-orders",
  isAuthenticated,
  getUserOrders
);

paymentRouter.get(
  "/user-dashboard-stats",
  isAuthenticated,
  getUserDashboardStats
);

export default paymentRouter;
