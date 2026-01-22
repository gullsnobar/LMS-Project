import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { redis } from "../utils/redis";
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

// edit Course
export const editCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const data = req.body;

    // Find course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const thumbnail = data.thumbnail;

    // Handle thumbnail update
    if (thumbnail) {
      // Delete old thumbnail if exists
      if (course.thumbnail?.public_id) {
        await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
      }

      // Upload new thumbnail
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courseThumbnails",
        resource_type: "image",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    // Update course in DB
    const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      course: updatedCourse,
    });
  }
);

// get single course ----- without purchasing

export const getSingleCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links")
    if (!course) {
      return next(new ErrorHandler("Course not found", 404))
    }
    res.status(200).json({
      success: true,
      course
    })

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }

})


// get all courses ----- without purchasing

export const getAllCourses = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const isCatchExist = await redis.get(courseId);
    if (isCatchExist) {
      return res.status(200).json({
        success: true,
        course: JSON.parse(isCatchExist)
      })
    }
    const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links")
    if (!courses) {
      return next(new ErrorHandler("Courses not found", 404))
    }
    res.status(200).json({
      success: true,
      courses
    })

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }

})
