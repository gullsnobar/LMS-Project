import { Response, NextFunction } from "express";
import OrderModel, { IOrder } from "../models/orderModel";
import User from "../models/user.model";
import CourseModel from "../models/course.models";

// Create new order and update user's course list
export const newOrder = async (
    data: any,
    res: Response,
    next: NextFunction
) => {
    try {
        // Create the order
        const order = await OrderModel.create(data);

        // Add course to user's enrolled courses
        const user = await User.findById(data.userId);
        if (user) {
            user.courses.push(data.courseId);
            await user.save();
        }

        // Increment course purchase count
        const course = await CourseModel.findById(data.courseId);
        if (course) {
            course.purchased = (course.purchased || 0) + 1;
            await course.save();
        }

        return order;
    } catch (error: any) {
        throw new Error(`Order creation failed: ${error.message}`);
    }
};

// get all orders

export const getAllOrdersService = async (res: Response) => {
    const orders = await OrderModel.find();
    res.status(201).json({
        success: true,
        orders,
    });
}