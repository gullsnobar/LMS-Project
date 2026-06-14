import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "/api/analytics/get-course-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getUsersAnalytics: builder.query({
      query: () => ({
        url: "/api/analytics/get-users-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "/api/analytics/get-order-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} = analyticsApi;