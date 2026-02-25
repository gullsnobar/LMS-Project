import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Send Stripe Publishable Key
export const sendStripePublishableKey = catchAsyncErrors(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// Create Payment Intent
export const newPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Invalid payment amount", 400));
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "usd",
        metadata: {
          company: "ELearning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
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
