import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";
import CourseModel from "../models/course.models";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { nextTick } from "process";

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



// get course content ----- with purchasing
export const getCourseByUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExist = userCourseList?.find((course: any) => course._id === courseId);
    if (!courseExist) {
      return next(new ErrorHandler("You are not authorized to access this course", 400))
    }
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return next(new ErrorHandler("Course not found", 404))
    }
    const courseContent = course.courseData
    res.status(200).json({
      success: true,
      courseContent
    })
  }
  catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// add questions in course

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId }: IAddQuestionData = req.body;

    const course = await CourseModel.findById(courseId);

    // FIX: handle null course
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content", 400));
    }

    const courseContent = (course.courseData as any[])?.find(
      (item: any) => item._id.equals(contentId)
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content id", 400));
    }

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    // add this question to course content
    courseContent.question.push(newQuestion);

    await course.save();

    res.status(200).json({
      success: true,
      courseContent,
    });
  }
);


// add answers in questions

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (
        !mongoose.Types.ObjectId.isValid(contentId) ||
        !mongoose.Types.ObjectId.isValid(questionId)
      ) {
        return next(new ErrorHandler("Invalid ID", 400));
      }

      const courseContent = (course.courseData as any[])?.find(
        (item: any) => item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Course content not found", 404));
      }

      const question = courseContent.question?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }

      if (!question.questionReplies) {
        question.questionReplies = [];
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);

      await course.save();

      if (
        req.user?._id &&
        question.user?._id &&
        question.user._id.toString() === req.user._id.toString()
      ) {
        return res.status(200).json({
          success: true,
          courseContent,
        });
      }

      const data = {
        name: question.user?.name,
        title: courseContent.title,
      };

      await ejs.renderFile(
        path.join(__dirname, "../mails/questionAnswer.ejs"),
        data
      );

      try {
        await sendMail({
          email: question.user?.email,
          subject: "Question Answer",
          template: "question-reply.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(200).json({
        success: true,
        courseContent,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
