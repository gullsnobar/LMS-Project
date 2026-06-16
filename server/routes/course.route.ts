import express from 'express';
import { uploadCourse, editCourse, getSingleCourse, getAllCourses, getCourseByUser, addQuestion, addAnswer, addReview, addReplyToReview, getAllCoursesAdmin } from '../controllers/course.controllers';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const courseRouter = express.Router();

// ── Admin: create / edit ──────────────────────────────────────────────────
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

// ── Public: browse all courses (no auth required) ─────────────────────────
courseRouter.get('/get-courses', getAllCourses);

// ── Public: single course preview (no auth required) ─────────────────────
courseRouter.get('/get-course/:id', getSingleCourse);

// ── Authenticated: full course content (purchased users) ─────────────────
courseRouter.get(
  '/get-course-content/:id',
  isAuthenticated,
  getCourseByUser
);

// ── Authenticated: questions & answers ───────────────────────────────────
courseRouter.put('/add-question', isAuthenticated, addQuestion);
courseRouter.put('/add-answer', isAuthenticated, addAnswer);

// ── Authenticated: reviews ────────────────────────────────────────────────
courseRouter.put('/add-review/:id', isAuthenticated, addReview);
courseRouter.put('/add-reply', isAuthenticated, addReplyToReview);

// ── Admin: all courses with full data ────────────────────────────────────
courseRouter.get(
  '/get-admin-courses',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllCoursesAdmin
);

export default courseRouter;
