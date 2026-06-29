import { apiSlice } from "../api/apiSlice";
export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/api/courses/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    
    getAllCourse: builder.query({
      query: () => ({
        url: "/api/courses/get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/api/courses/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/courses/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getUsersAllCourses: builder.query({
      query: () => ({
        url: `/api/courses/get-courses`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `/api/courses/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getCourseContent: builder.query({
      query: (arg) => {
        // Backwards compatible: allow calling with just `id` (string)
        const id = typeof arg === "string" ? arg : arg?.id;
        const userId = typeof arg === "string" ? undefined : arg?.userId;
        const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
        return {
          url: `/api/courses/get-course-content/${id}${qs}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
    }),
    
    addnewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `/api/courses/add-question`,
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: `/api/courses/add-answer`,
        method: "PUT",
        body: { answer, courseId, contentId, questionId },
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `/api/courses/add-review/${courseId}`,
        method: `PUT`,
        body: { review, rating },
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }) => ({
        // server route is "/add-reply" (not /add-reply/:id); controller reads courseId from body
        url: `/api/courses/add-reply`,
        method: "PUT",
        body: { comment, courseId, reviewId },
        credentials: "include" as const,
      }),
    }),
    getAdminAllCourses: builder.query({
      query: () => ({
        url: "/api/courses/get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getVdoCipherOtp: builder.mutation({
      query: (courseId) => ({
        url: `/api/v1/video/demo/${courseId}`,
        method: "POST",
        credentials: "include" as const,
      }),
    }),
  }),
});
export const {
  useCreateCourseMutation,
  useGetAllCourseQuery,
  useGetAdminAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddnewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
  useGetVdoCipherOtpMutation,
} = courseApi;