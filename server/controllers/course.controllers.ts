import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.models";

// upload Course
export const uploadCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;

    if (!thumbnail) {
      return next(new ErrorHandler("Thumbnail is required", 400));
    }

    // Upload thumbnail
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courseThumbnails",
      resource_type: "image",
    });

    data.thumbnail = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    // Create course in DB
    const course = await CourseModel.create(data);

    res.status(201).json({
      success: true,
      course,
    });
  }
);


// edit course

export const editCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(data.oldThumbnailPublicId);
          }
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "courses",
            resource_type: "image",
          });
          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
    }
    catch (error:any) {
      return next(new ErrorHandler(error.message, 500));
    }
    }   

);