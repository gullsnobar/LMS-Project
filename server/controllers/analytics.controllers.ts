import { Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generators";
import userModel from "../models/user.model";
import courseModel from "../models/course.models";
import orderModel from "../models/orderModel";
import { Model } from "mongoose";

// reusable analytics controller (modern + DRY)
const createAnalyticsController =
    (model: Model<any>, key: string) =>
        catchAsyncErrors(async (_req: Request, res: Response) => {
            const data = await generateLast12MonthsData(model);

            res.status(200).json({
                success: true,
                [key]: data,
            });
        });

// get users analytics - only for admin
export const getUsersAnalytics = createAnalyticsController(
    userModel,
    "users"
);

// get courses analytics - only for admin
export const getCoursesAnalytics = createAnalyticsController(
    courseModel,
    "courses"
);

// get orders analytics - only for admin
export const getOrdersAnalytics = createAnalyticsController(
    orderModel,
    "orders"
);
