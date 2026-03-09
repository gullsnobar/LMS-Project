import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  sendStripePublishableKey,
  newPayment,
  getUserOrders,
  getUserDashboardStats,
  enrollFreeCourse,
  processRefund,
  getOrderReceipt,
  stripeWebhook,
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

// Free course enrollment
paymentRouter.post(
  "/payment/enroll-free",
  isAuthenticated,
  enrollFreeCourse
);

// Admin: Process refund
paymentRouter.post(
  "/payment/refund",
  isAuthenticated,
  authorizeRoles("admin"),
  processRefund
);

// Get order receipt
paymentRouter.get(
  "/payment/receipt/:orderId",
  isAuthenticated,
  getOrderReceipt
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

export { stripeWebhook };
export default paymentRouter;
