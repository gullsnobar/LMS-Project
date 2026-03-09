import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import Stripe from "stripe";
import OrderModel from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.models";
import CouponModel from "../models/couponModel";
import NotificationModel from "../models/notificationModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Send Stripe Publishable Key
export const sendStripePublishableKey = catchAsyncErrors(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// Create Payment Intent (enhanced with coupon support and metadata)
export const newPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, courseId, couponCode } = req.body;
      const userId = req.user?._id;

      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Invalid payment amount", 400));
      }

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      // Build metadata for tracking
      const metadata: Record<string, string> = {
        company: "ELearning",
        courseId: courseId,
        userId: userId?.toString() || "",
      };

      if (couponCode) {
        metadata.couponCode = couponCode;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "usd",
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: req.user?.email || undefined,
      });

      res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Free course enrollment (no payment needed)
export const enrollFreeCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { courseId } = req.body;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (course.price !== 0) {
        return next(new ErrorHandler("This course is not free", 400));
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if already enrolled
      const alreadyEnrolled = user.courses.some(
        (item: any) => item.courseId?.toString() === courseId.toString() || item._id?.toString() === courseId.toString()
      );

      if (alreadyEnrolled) {
        return next(new ErrorHandler("You are already enrolled in this course", 400));
      }

      // Create order record for free course
      await OrderModel.create({
        courseId,
        userId,
        payment_info: { type: "free_enrollment" },
        status: "completed",
        paymentMethod: "free",
        amount: 0,
        currency: "usd",
      });

      // Add course to user
      user.courses.push({ courseId });
      await user.save();

      // Increment purchase count
      course.purchased = (course.purchased || 0) + 1;
      await course.save();

      // Create notification
      await NotificationModel.create({
        title: "New Enrollment",
        message: `${user.name} enrolled in free course: ${course.name}`,
      } as any);

      res.status(200).json({
        success: true,
        message: "Successfully enrolled in the course",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Admin: Process refund
export const processRefund = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, reason } = req.body;

      if (!orderId) {
        return next(new ErrorHandler("Order ID is required", 400));
      }

      const order = await OrderModel.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      if (order.status === "refunded") {
        return next(new ErrorHandler("This order has already been refunded", 400));
      }

      // Process Stripe refund if it was a paid order
      let refund;
      const paymentInfo = order.payment_info as any;
      if (paymentInfo?.id && paymentInfo.id !== "free_enrollment") {
        refund = await stripe.refunds.create({
          payment_intent: paymentInfo.id,
          reason: "requested_by_customer",
        });
      }

      // Update order status
      order.status = "refunded";
      order.refundId = refund?.id || "free_refund";
      order.refundReason = reason || "No reason provided";
      order.refundedAt = new Date();
      await order.save();

      // Remove course from user's courses
      const user = await userModel.findById(order.userId);
      if (user) {
        user.courses = user.courses.filter(
          (c: any) => c.courseId?.toString() !== order.courseId.toString()
        );
        await user.save();
      }

      // Decrement purchase count
      const course = await CourseModel.findById(order.courseId);
      if (course && course.purchased > 0) {
        course.purchased -= 1;
        await course.save();
      }

      // Create notification
      await NotificationModel.create({
        title: "Order Refunded",
        message: `Refund processed for order ${orderId}. Reason: ${reason || "N/A"}`,
        userId: order.userId,
      });

      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refund: refund || null,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get order receipt / invoice data
export const getOrderReceipt = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      const order = await OrderModel.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // Only allow the order's owner or admin to view receipt
      if (order.userId.toString() !== userId.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to view this receipt", 403));
      }

      const course = await CourseModel.findById(order.courseId).select(
        "name thumbnail price level tags"
      );
      const user = await userModel.findById(order.userId).select("name email");

      // Try to get Stripe receipt URL if available
      let receiptUrl = null;
      const paymentInfo = order.payment_info as any;
      if (paymentInfo?.latest_charge) {
        try {
          const charge = await stripe.charges.retrieve(paymentInfo.latest_charge);
          receiptUrl = charge.receipt_url;
        } catch {
          // Stripe receipt not available
        }
      }

      res.status(200).json({
        success: true,
        receipt: {
          orderId: order._id,
          orderDate: (order as any).createdAt,
          status: order.status,
          course: course
            ? {
                name: course.name,
                thumbnail: course.thumbnail,
                price: course.price,
                level: course.level,
              }
            : null,
          user: user
            ? {
                name: user.name,
                email: user.email,
              }
            : null,
          payment: {
            method: order.paymentMethod,
            amount: order.amount,
            currency: order.currency,
            couponCode: order.couponCode,
            discountAmount: order.discountAmount,
          },
          refund: order.status === "refunded"
            ? {
                refundId: order.refundId,
                reason: order.refundReason,
                refundedAt: order.refundedAt,
              }
            : null,
          stripeReceiptUrl: receiptUrl,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Stripe Webhook handler
export const stripeWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: "Missing webhook signature or secret" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { courseId, userId, couponCode } = paymentIntent.metadata;

      if (courseId && userId) {
        // Verify the order was created; if not, create one (safety net)
        const existingOrder = await OrderModel.findOne({
          courseId,
          userId,
          status: "completed",
        });

        if (!existingOrder) {
          await OrderModel.create({
            courseId,
            userId,
            payment_info: paymentIntent,
            status: "completed",
            paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            couponCode: couponCode || undefined,
          });

          // Update user courses
          const user = await userModel.findById(userId);
          if (user) {
            const alreadyHas = user.courses.some(
              (c: any) => c.courseId?.toString() === courseId
            );
            if (!alreadyHas) {
              user.courses.push({ courseId });
              await user.save();
            }
          }

          // Increment course purchase count
          const course = await CourseModel.findById(courseId);
          if (course) {
            course.purchased = (course.purchased || 0) + 1;
            await course.save();
          }
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      console.error(
        "Payment failed for intent:",
        failedIntent.id,
        failedIntent.last_payment_error?.message
      );
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent;

      if (paymentIntentId) {
        const order = await OrderModel.findOne({
          "payment_info.id": paymentIntentId,
        });

        if (order && order.status !== "refunded") {
          order.status = "refunded";
          order.refundedAt = new Date();
          await order.save();
        }
      }
      break;
    }

    default:
      // Unhandled event type
      break;
  }

  res.status(200).json({ received: true });
};

// Get User Orders
export const getUserOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      const OrderModel = (await import("../models/orderModel")).default;
      const CourseModel = (await import("../models/course.models")).default;

      const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });

      // Enrich orders with course details
      const enrichedOrders = await Promise.all(
        orders.map(async (order: any) => {
          const course = await CourseModel.findById(order.courseId).select(
            "name thumbnail price level tags"
          );
          return {
            _id: order._id,
            courseId: order.courseId,
            userId: order.userId,
            payment_info: order.payment_info,
            createdAt: order.createdAt,
            course: course
              ? {
                  name: course.name,
                  thumbnail: course.thumbnail,
                  price: course.price,
                  level: course.level,
                  tags: course.tags,
                }
              : null,
          };
        })
      );

      res.status(200).json({
        success: true,
        orders: enrichedOrders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get Dashboard Stats for user
export const getUserDashboardStats = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      const User = (await import("../models/user.model")).default;
      const OrderModel = (await import("../models/orderModel")).default;
      const CourseModel = (await import("../models/course.models")).default;

      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const enrolledCourseIds = user.courses.map((c: any) => c.courseId);
      const enrolledCourses = await CourseModel.find({
        _id: { $in: enrolledCourseIds },
      }).select("name thumbnail price level tags courseData ratings purchased");

      const totalOrders = await OrderModel.countDocuments({ userId });
      const totalSpent = await OrderModel.aggregate([
        { $match: { userId: userId.toString() } },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
      ]);

      // Calculate total amount spent
      let amountSpent = 0;
      for (const course of enrolledCourses) {
        amountSpent += course.price || 0;
      }

      // Calculate total lectures
      let totalLectures = 0;
      for (const course of enrolledCourses) {
        totalLectures += course.courseData?.length || 0;
      }

      // Calculate certificates (completed courses - for now, all enrolled)
      const certificates = enrolledCourses.length;

      res.status(200).json({
        success: true,
        stats: {
          enrolledCourses: enrolledCourses.length,
          totalOrders,
          amountSpent,
          totalLectures,
          certificates,
          courses: enrolledCourses,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
