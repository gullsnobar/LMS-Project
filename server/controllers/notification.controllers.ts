import NotificationModel from "../models/notificationModel";
import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";


// get all notification  -- only admin

export const getNotification = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            notification,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update notification -- only admin

export const updateNotification = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        notification.status = "read";
        await notification.save();
        res.status(200).json({
            success: true,
            notification,
        });
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


// delete notification -- automatically delete read notifications older than 30 days

cron.schedule("0 0 0 * * *", async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await NotificationModel.deleteMany({
            status: "read",
            createdAt: { $lt: thirtyDaysAgo }
        });
        console.log(`Deleted ${result.deletedCount} old read notifications`);
    } catch (error: any) {
        console.error("Error deleting old notifications:", error.message);
    }
})