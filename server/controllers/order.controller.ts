import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.models";
import NotificationModel from "../models/notificationModel";
import { newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// create order
export const createOrder = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { courseId, payment_info } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        // 1. Check user
        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // 2. Check course
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // 3. Check if course already exists for user
        const courseExistsInUser = user.courses.some(
            (item: any) => item._id.toString() === courseId.toString()
        );

        if (courseExistsInUser) {
            return next(
                new ErrorHandler("You have already purchased this course", 400)
            );
        }

        // 4. Create order data
        const orderData: any = {
            courseId,
            userId,
            payment_info,
        };

        // Call service to create order and update user/course
        const order = await newOrder(orderData, res, next);

        // 5. Prepare email data
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };

        const html = await ejs.renderFile(
            path.join(__dirname, "../views/order-confirmation.ejs"),
            { order: mailData }
        );
        // 6. Send confirmation email
        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        } catch (error: any) {
            console.error("Failed to send order confirmation email:", error);
        }

        user?.courses.push(courseId);
        await user?.save();

        const notification = new NotificationModel({
            title: "New Order",
            message: `New order placed by ${user.name}`,
            userId: user._id,
            courseId: courseId,
        });
        await notification.save();

        // 7. Send response
        res.status(201).json({
            success: true,
            order: course,
        });
    }
);
