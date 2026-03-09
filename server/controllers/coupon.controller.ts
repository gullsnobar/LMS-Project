import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CouponModel from "../models/couponModel";
import CourseModel from "../models/course.models";

// Admin: Create a coupon
export const createCoupon = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            code,
            discountType,
            discountValue,
            maxUses,
            minOrderAmount,
            maxDiscount,
            expiresAt,
            applicableCourses,
        } = req.body;

        if (!code || !discountType || discountValue == null || !expiresAt) {
            return next(new ErrorHandler("Please provide all required fields", 400));
        }

        if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
            return next(new ErrorHandler("Percentage discount must be between 1 and 100", 400));
        }

        const existing = await CouponModel.findOne({ code: code.toUpperCase() });
        if (existing) {
            return next(new ErrorHandler("Coupon code already exists", 400));
        }

        const coupon = await CouponModel.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            maxUses: maxUses || 0,
            minOrderAmount: minOrderAmount || 0,
            maxDiscount,
            expiresAt: new Date(expiresAt),
            applicableCourses: applicableCourses || [],
            createdBy: req.user?._id,
        });

        res.status(201).json({
            success: true,
            coupon,
        });
    }
);

// Admin: Get all coupons
export const getAllCoupons = catchAsyncErrors(
    async (_req: Request, res: Response, _next: NextFunction) => {
        const coupons = await CouponModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            coupons,
        });
    }
);

// Admin: Delete a coupon
export const deleteCoupon = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const coupon = await CouponModel.findById(req.params.id);

        if (!coupon) {
            return next(new ErrorHandler("Coupon not found", 404));
        }

        await CouponModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    }
);

// Admin: Update a coupon
export const updateCoupon = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const coupon = await CouponModel.findById(req.params.id);

        if (!coupon) {
            return next(new ErrorHandler("Coupon not found", 404));
        }

        const updatedCoupon = await CouponModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            coupon: updatedCoupon,
        });
    }
);

// User: Apply / Validate a coupon code
export const applyCoupon = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { code, courseId } = req.body;

        if (!code || !courseId) {
            return next(new ErrorHandler("Coupon code and course ID are required", 400));
        }

        const coupon = await CouponModel.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return next(new ErrorHandler("Invalid or expired coupon code", 404));
        }

        // Check expiry
        if (new Date(coupon.expiresAt) < new Date()) {
            return next(new ErrorHandler("This coupon has expired", 400));
        }

        // Check usage limit
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return next(new ErrorHandler("This coupon has reached its usage limit", 400));
        }

        // Check if applicable to this course
        if (
            coupon.applicableCourses.length > 0 &&
            !coupon.applicableCourses.includes(courseId)
        ) {
            return next(new ErrorHandler("This coupon is not valid for this course", 400));
        }

        // Get course price
        const course = await CourseModel.findById(courseId).select("price");
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Check minimum order amount
        if (course.price < coupon.minOrderAmount) {
            return next(
                new ErrorHandler(
                    `Minimum order amount for this coupon is $${coupon.minOrderAmount}`,
                    400
                )
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (course.price * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed price
        discountAmount = Math.min(discountAmount, course.price);
        const finalPrice = Math.max(0, course.price - discountAmount);

        res.status(200).json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
            originalPrice: course.price,
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            finalPrice: parseFloat(finalPrice.toFixed(2)),
        });
    }
);
