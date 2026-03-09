import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxUses: number;
    usedCount: number;
    minOrderAmount: number;
    maxDiscount?: number;
    expiresAt: Date;
    isActive: boolean;
    applicableCourses: string[]; // empty = all courses
    createdBy: string;
}

const couponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maxUses: {
            type: Number,
            default: 0, // 0 = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number, // cap for percentage discounts
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        applicableCourses: [
            {
                type: String, // courseId strings; empty = applies to all
            },
        ],
        createdBy: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expiresAt: 1 });

const CouponModel: Model<ICoupon> = mongoose.model("Coupon", couponSchema);

export default CouponModel;
