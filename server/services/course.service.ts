import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.models";

export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;

    if (!thumbnail) {
      return next(new ErrorHandler("Thumbnail is required", 400));
    }

    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courseThumbnails",
      resource_type: "image",
    });

    const course = await CourseModel.create({
      name: data.title,            // FIXED HERE
      description: data.description,
      price: data.price,
      estimatedTime: data.estimatedTime,
      tags: data.tags,
      level: data.level,
      demoUrl: data.demoUrl,
      benefits: data.benefits,
      prerequisites: data.prerequisites,
      courseData: data.courseData,
      thumbnail: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      course,
    });
  }
);
