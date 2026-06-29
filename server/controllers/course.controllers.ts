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

    // Invalidate courses list cache
    await redis.del("all_courses");

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

    // Invalidate courses list cache
    await redis.del("all_courses");

    res.status(200).json({
      success: true,
      course: updatedCourse,
    });
  }
);

// get single course ----- without purchasing

export const getSingleCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseIdOrSlug = req.params.id;
    let query: any = {};
    
    if (mongoose.Types.ObjectId.isValid(courseIdOrSlug) && /^[0-9a-fA-F]{24}$/.test(courseIdOrSlug)) {
      query = { _id: courseIdOrSlug };
    } else {
      query = { $or: [{ slug: courseIdOrSlug }, { name: { $regex: new RegExp(`^${courseIdOrSlug}$`, 'i') } }] };
    }

    const course = await CourseModel.findOne(query).select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links -courseData.videoCipherVideoId -videoCipherVideoId");
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
    // Use a fixed cache key — req.params.id is undefined on /get-courses
    const cacheKey = "all_courses";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        courses: JSON.parse(cached),
      });
    }

    const courses = await CourseModel.find().select(
      "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links -courseData.videoCipherVideoId -videoCipherVideoId"
    );

    // Cache for 10 minutes
    await redis.set(cacheKey, JSON.stringify(courses), "EX", 10 * 60);

    res.status(200).json({
      success: true,
      courses,
    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})




// get course content ----- with purchasing
export const getCourseByUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCourseList = req.user?.courses || [];
    const courseIdOrSlug = req.params.id;

    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(courseIdOrSlug) && /^[0-9a-fA-F]{24}$/.test(courseIdOrSlug)) {
      query = { _id: courseIdOrSlug };
    } else {
      query = { $or: [{ slug: courseIdOrSlug }, { name: { $regex: new RegExp(`^${courseIdOrSlug}$`, 'i') } }] };
    }

    const course = await CourseModel.findOne(query);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404))
    }

    const courseExist = userCourseList?.find((c: any) => {
      const cId = c?.courseId ?? c?._id ?? c;
      return cId?.toString() === course._id.toString();
    });
    
    if (!courseExist) {
      return next(new ErrorHandler("You are not authorized to access this course", 400))
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


// add review in course

interface IAddReviewData {
  review: string;
  rating: number;
}

export const addReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    /* -------------------- Authorization Check -------------------- */

    const userCourseList = req.user?.courses || [];

    const isEnrolled = userCourseList.some(
      (course: any) => course._id.toString() === courseId
    );

    if (!isEnrolled) {
      return next(
        new ErrorHandler(
          "You are not authorized to add a review to this course",
          403
        )
      );
    }

    /* -------------------- Course Lookup -------------------- */

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    /* -------------------- Review Data -------------------- */

    const { review, rating } = req.body as IAddReviewData;

    if (!review || typeof rating !== "number") {
      return next(new ErrorHandler("Review and rating are required", 400));
    }

    const reviewData = {
      user: req.user,
      review,
      rating,
    };

    /* -------------------- Add Review -------------------- */

    course.reviews.push(reviewData);
    course.numOfReviews = course.reviews.length;

    /* -------------------- Rating Calculation -------------------- */

    const totalRating = course.reviews.reduce(
      (sum: number, rev: any) => sum + (rev.rating || 0),
      0
    );

    course.ratings =
      course.reviews.length > 0
        ? totalRating / course.reviews.length
        : 0;

    await course.save();

    /* -------------------- Notification -------------------- */

    const notification = {
      title: "New Review Received",
      message: `${req.user?.name} has reviewed ${course.name}`,
      user: course.instructor, // adjust if your schema differs
    };

    // await NotificationModel.create(notification);

    /* -------------------- Response -------------------- */

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      course,
    });
  }
);

// add reply in review

interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
    const course = await CourseModel.findById(courseId);


    if (!course) {
      return next(new ErrorHandler("Course is not found", 400));
    }

    const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId);

    if (!review) {
      return next(new ErrorHandler("Review is not found", 400));
    }

    const replyData: any = {
      user: req.user,
      comment,
    }

    course.reviews.push(replyData);
    await course.save();

    res.status(200).json({
      success: true,
      course,
    })
  }
  catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
})

// get all courses -- admin

export const getAllCoursesAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find();
      res.status(201).json({
        success: true,
        courses,
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);