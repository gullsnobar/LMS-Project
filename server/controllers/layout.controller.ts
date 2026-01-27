import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors as CatchAsyncError } from "../middleware/catchAsyncErrors";

// create layout (Banner only for now)
export const createLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.body;

        try {
            const isTypeExist = await LayoutModel.findOne({ type });
            if (isTypeExist) {
                return next(new ErrorHandler("Layout already exists", 400));
            }

            // ---------------- Banner ----------------
            if (type === "Banner") {
                const { image, title, subTitle } = req.body;

                if (!image || !title || !subTitle) {
                    return next(
                        new ErrorHandler("Image, title and subtitle are required", 400)
                    );
                }

                const uploadResult = await cloudinary.uploader.upload(image, {
                    folder: "layout",
                });

                const layoutData: any = {
                    type: "Banner",
                    banner: {
                        image: [
                            {
                                public_id: uploadResult.public_id,
                                secure_url: uploadResult.secure_url,
                            },
                        ],
                        title,
                        subTitle,
                    },
                };

                await LayoutModel.create(layoutData);
            }

            // ---------------- FAQ ----------------
            if (type === "FAQ") {
                const { faq } = req.body;

                const faqItems = faq.map((item: any) => ({
                    question: item.question,
                    answer: item.answer,
                }));

                await LayoutModel.create({ type: "FAQ", faq: faqItems });
            }

            

            if (type === "Categories") {
                const { categories } = req.body;

                const categoriesData = categories.map((item: any) => ({
                    name: item.title,
                    slug: item.title.toLowerCase().replace(/\s+/g, '-'),
                }));

                await LayoutModel.create({
                    type: "Categories",
                    category: categoriesData,
                });
            }

            res.status(201).json({
                success: true,
                message: "Layout created successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
);


// edit layout
export const editLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body;

            // ---------------- Banner ----------------
            if (type === "Banner") {
                const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

                if (!bannerData) {
                    return next(new ErrorHandler("Banner layout not found", 404));
                }

                const { image, title, subTitle } = req.body;

                if (!title || !subTitle) {
                    return next(
                        new ErrorHandler("Title and subtitle are required", 400)
                    );
                }

                // Only upload new image if provided
                if (image) {
                    // Delete old image from cloudinary
                    if (bannerData.banner?.image?.[0]?.public_id) {
                        await cloudinary.uploader.destroy(
                            bannerData.banner.image[0].public_id
                        );
                    }

                    const uploadResult = await cloudinary.uploader.upload(image, {
                        folder: "layout",
                    });

                    bannerData.banner = {
                        image: [
                            {
                                public_id: uploadResult.public_id,
                                secure_url: uploadResult.secure_url,
                            },
                        ],
                        title,
                        subTitle,
                    };
                } else {
                    bannerData.banner.title = title;
                    bannerData.banner.subTitle = subTitle;
                }

                await bannerData.save();
            }

            // ---------------- FAQ ----------------
            if (type === "FAQ") {
                const { faq } = req.body;

                if (!faq || !Array.isArray(faq)) {
                    return next(new ErrorHandler("FAQ items are required", 400));
                }

                const faqData = await LayoutModel.findOne({ type: "FAQ" });

                if (!faqData) {
                    return next(new ErrorHandler("FAQ layout not found", 404));
                }

                const faqItems = faq.map((item: any) => ({
                    question: item.question,
                    answer: item.answer,
                }));

                faqData.faq = faqItems;
                await faqData.save();
            }

            // ---------------- Categories ----------------
            if (type === "Categories") {
                const { categories } = req.body;

                if (!categories || !Array.isArray(categories)) {
                    return next(new ErrorHandler("Categories are required", 400));
                }

                const categoryData = await LayoutModel.findOne({ type: "Categories" });

                if (!categoryData) {
                    return next(new ErrorHandler("Categories layout not found", 404));
                }

                const categoriesData = categories.map((item: any) => ({
                    name: item.title,
                    slug: item.title.toLowerCase().replace(/\s+/g, '-'),
                }));

                categoryData.category = categoriesData;
                await categoryData.save();
            }

            res.status(200).json({
                success: true,
                message: "Layout updated successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
);

// get layout by type
export const getLayoutByType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.params;

            const layout = await LayoutModel.findOne({ type });

            if (!layout) {
                return next(new ErrorHandler(`${type} layout not found`, 404));
            }

            res.status(200).json({
                success: true,
                layout,
            });
        } catch (error) {
            return next(error);
        }
    }
);