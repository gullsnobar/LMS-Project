import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors as CatchAsyncError } from "../middleware/catchAsyncErrors";

// create layout (Banner only for now)
export const createLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.body;

        if (type !== "Banner") {
            return next(new ErrorHandler("Invalid layout type", 400));
        }

        const { image, title, subTitle } = req.body;

        if (!image || !title || !subTitle) {
            return next(
                new ErrorHandler("Image, title and subtitle are required", 400)
            );
        }

        // upload image to cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "layout",
        });

        const layoutData = {
            type: "Banner",
            banner: {
                image: [{
                    public_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url,
                }],
                title,
                subTitle,
            },
        };

        const layout = await LayoutModel.create(layoutData);

        res.status(201).json({
            success: true,
            layout,
        });
    }
);
