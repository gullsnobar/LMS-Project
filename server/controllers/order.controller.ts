import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.models";
import CouponModel from "../models/couponModel";
import NotificationModel from "../models/notificationModel";
import { getAllOrdersService, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// create order
export const createOrder = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { courseId, payment_info, couponCode } = req.body;
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
            (item: any) => item._id?.toString() === courseId.toString() || item.courseId?.toString() === courseId.toString()
        );

        if (courseExistsInUser) {
            return next(
                new ErrorHandler("You have already purchased this course", 400)
            );
        }

        // 4. Calculate coupon discount if applicable
        let discountAmount = 0;
        let appliedCouponCode: string | undefined;

        if (couponCode) {
            const coupon = await CouponModel.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
            });

            if (coupon && new Date(coupon.expiresAt) > new Date()) {
                if (coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses) {
                    if (coupon.discountType === "percentage") {
                        discountAmount = (course.price * coupon.discountValue) / 100;
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                            discountAmount = coupon.maxDiscount;
                        }
                    } else {
                        discountAmount = coupon.discountValue;
                    }

                    discountAmount = Math.min(discountAmount, course.price);
                    appliedCouponCode = coupon.code;

                    // Increment coupon usage
                    coupon.usedCount += 1;
                    await coupon.save();
                }
            }
        }

        const finalAmount = Math.max(0, course.price - discountAmount);

        // 5. Create order data
        const orderData: any = {
            courseId,
            userId,
            payment_info,
            status: "completed",
            paymentMethod: payment_info?.payment_method_types?.[0] || "card",
            amount: finalAmount,
            currency: "usd",
            couponCode: appliedCouponCode,
            discountAmount,
        };

        // Call service to create order and update user/course
        const order = await newOrder(orderData, res, next);

        // 6. Prepare email data
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: finalAmount,
                originalPrice: course.price,
                discount: discountAmount,
                couponCode: appliedCouponCode,
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
        // 7. Send confirmation email
        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }

            course.purchased ? course.purchased += 1 : course.purchased = 1;
            await course.save();
        } catch (error: any) {
            console.error("Failed to send order confirmation email:", error);
        }

        user?.courses.push(courseId);
        await user?.save();

        const notification = new NotificationModel({
            title: "New Order",
            message: `New order placed by ${user.name} for ${course.name}${appliedCouponCode ? ` (coupon: ${appliedCouponCode})` : ""}`,
            userId: user._id,
            courseId: courseId,
        });
        await notification.save();

        // 8. Send response
        res.status(201).json({
            success: true,
            order: course,
        });
    }
);

// get all orders


export const getAllOrdersServices = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getAllOrdersService(res);
        } catch (error) {
            if (error instanceof Error) {
                return next(new ErrorHandler(error.message, 400));
            }
            return next(new ErrorHandler("Something went wrong", 500));
        }
    }
);