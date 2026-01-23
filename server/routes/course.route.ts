import express from 'express';
import { uploadCourse, editCourse, getSingleCourse, getAllCourses, getCourseByUser, addQuestion, addAnswer, addReview, addReplyToReview } from '../controllers/course.controllers';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const courseRouter = express.Router();

courseRouter.post(
  '/create-course',
  isAuthenticated,
  authorizeRoles('admin'),
  uploadCourse
);

courseRouter.put(
  '/edit-course/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  editCourse
);

courseRouter.get(
  '/get-course/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  getSingleCourse
);

courseRouter.get(
  '/get-courses',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllCourses
);

courseRouter.get(
  '/get-course-content/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  getCourseByUser
);

courseRouter.put(
  '/add-question',
  isAuthenticated,
  authorizeRoles('admin'),
  addQuestion
);

courseRouter.put(
  '/add-answer',
  isAuthenticated,
  authorizeRoles('admin'),
  addAnswer
);

courseRouter.put(
  '/add-review',
  isAuthenticated,
  authorizeRoles('admin'),
  addReview
);

courseRouter.put(
  '/add-reply',
  isAuthenticated,
  authorizeRoles('admin'),
  addReplyToReview
);


export default courseRouter;
