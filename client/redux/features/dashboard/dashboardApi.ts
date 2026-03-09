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
    getOrderReceipt: builder.query({
      query: (orderId) => ({
        url: `payment/receipt/${orderId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // Admin: Process refund
    processRefund: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: "payment/refund",
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
