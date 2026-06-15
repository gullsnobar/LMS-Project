import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import OrderModel from "../models/orderModel";
import courseModel from "../models/course.models";

/* ================================================================
   GET /api/v1/user-dashboard-stats
   Returns: enrolled courses count, total lectures, certificates
            count, total amount spent, and populated courses list.
   ================================================================ */
export const getUserDashboardStats = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      // Fetch fresh user from DB (with courses array)
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Extract course IDs from user.courses
      const courseIds: string[] = user.courses
        .map((c: any) => c.courseId || c._id?.toString() || c?.toString())
        .filter(Boolean);

      // Fetch all enrolled courses in one query
      const enrolledCourses = courseIds.length
        ? await courseModel
            .find({ _id: { $in: courseIds } })
            .select("name thumbnail ratings courseData level estimatedTime")
        : [];

      // Total lectures = sum of courseData lengths
      const totalLectures = enrolledCourses.reduce(
        (sum, course) => sum + (course.courseData?.length || 0),
        0
      );

      // Fetch user's orders to compute amount spent
      const orders = await OrderModel.find({
        userId: userId.toString(),
        status: { $in: ["completed"] },
      })
        .sort({ createdAt: -1 })
        .lean();

      const amountSpent = orders.reduce(
        (sum, o) => sum + (o.amount || 0),
        0
      );

      // "Certificates" = number of enrolled courses
      // (all enrolled courses count as a certificate of enrollment)
      const certificates = enrolledCourses.length;

      return res.status(200).json({
        success: true,
        stats: {
          enrolledCourses: enrolledCourses.length,
          totalLectures,
          certificates,
          amountSpent: parseFloat(amountSpent.toFixed(2)),
          courses: enrolledCourses,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      return next(new ErrorHandler(message, 500));
    }
  }
);

/* ================================================================
   GET /api/v1/user-orders
   Returns: the authenticated user's full order history with
            course name, thumbnail, price, and level populated.
   ================================================================ */
export const getUserOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      // Fetch all orders for this user
      const orders = await OrderModel.find({ userId: userId.toString() })
        .sort({ createdAt: -1 })
        .lean();

      if (!orders.length) {
        return res.status(200).json({ success: true, orders: [] });
      }

      // Collect unique course IDs
      const courseIds = [...new Set(orders.map((o) => o.courseId))];

      // Batch-fetch course info
      const courses = await courseModel
        .find({ _id: { $in: courseIds } })
        .select("name thumbnail price level ratings courseData")
        .lean();

      const courseMap = new Map(courses.map((c: any) => [c._id.toString(), c]));

      // Attach course info to each order
      const populatedOrders = orders.map((order) => ({
        ...order,
        course: courseMap.get(order.courseId?.toString()) || null,
      }));

      return res.status(200).json({
        success: true,
        orders: populatedOrders,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      return next(new ErrorHandler(message, 500));
    }
  }
);
