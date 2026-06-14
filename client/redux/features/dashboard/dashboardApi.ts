import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardStats: builder.query({
      query: () => ({
        url: "/api/v1/user-dashboard-stats",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUserOrders: builder.query({
      query: () => ({
        url: "/api/v1/user-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrderReceipt: builder.query({
      query: (orderId) => ({
        url: `/api/v1/payment/receipt/${orderId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // Admin: Process refund
    processRefund: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: "/api/v1/payment/refund",
        method: "POST",
        body: { orderId, reason },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetUserDashboardStatsQuery,
  useGetUserOrdersQuery,
  useGetOrderReceiptQuery,
  useProcessRefundMutation,
} = dashboardApi;
