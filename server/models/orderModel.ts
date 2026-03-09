import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
    status: "pending" | "completed" | "refunded" | "failed";
    paymentMethod: string;
    amount: number;
    currency: string;
    couponCode?: string;
    discountAmount?: number;
    refundId?: string;
    refundReason?: string;
    refundedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        courseId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        payment_info: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "refunded", "failed"],
            default: "completed",
        },
        paymentMethod: {
            type: String,
            default: "card",
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "usd",
        },
        couponCode: {
            type: String,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        refundId: {
            type: String,
        },
        refundReason: {
            type: String,
        },
        refundedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ courseId: 1 });
orderSchema.index({ status: 1 });

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;
