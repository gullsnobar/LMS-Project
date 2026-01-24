import NotificationModel from "../models/notificationModel";
import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";


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
