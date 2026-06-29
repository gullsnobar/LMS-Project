import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
  sendStripePublishableKey,
  newPayment,
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

paymentRouter.get(
  "/payment/receipt/:orderId",
  isAuthenticated,
  getOrderReceipt
);

export { stripeWebhook };
export default paymentRouter;
