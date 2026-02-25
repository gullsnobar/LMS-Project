import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardStats: builder.query({
      query: () => ({
        url: "user-dashboard-stats",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserOrders: builder.query({
      query: () => ({
        url: "user-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetUserDashboardStatsQuery, useGetUserOrdersQuery } =
  dashboardApi;
