import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.models";

export const getDemoVideoCipherOtp = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (!course.freePreviewEnabled) {
      return next(new ErrorHandler("Free preview is not enabled for this course", 403));
    }

    if (!course.videoCipherVideoId) {
      return next(new ErrorHandler("Demo video is not available for this course", 404));
    }

    const videoId = course.videoCipherVideoId;
    const url = `https://dev.vdocipher.com/api/videos/${videoId}/otp`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Apisecret ${process.env.VDO_CIPHER_API_KEY}`,
      },
      body: JSON.stringify({
        ttl: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return next(new ErrorHandler(data.message || "Failed to fetch OTP from VideoCipher", response.status));
    }

    res.status(200).json({
      success: true,
      otp: data.otp,
      playbackInfo: data.playbackInfo,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});
