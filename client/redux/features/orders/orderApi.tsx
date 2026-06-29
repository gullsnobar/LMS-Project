import { apiSlice } from "../api/apiSlice";
export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: "/api/orders/get-all-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getStripePublishAbleKey: builder.query({
      query: () => ({
        url: "/api/v1/payment/stripePublishAbleKey",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    createPaymentIntent: builder.mutation({
      query: ({ amount, courseId, couponCode }) => ({
        url: "/api/v1/payment/process",
        method: "POST",
        body: { amount, courseId, couponCode },
        credentials: "include" as const,
      }),
    }),

    createOrder: builder.mutation({
      query: ({ courseId, payment_info, userId, couponCode }) => ({
        url: "/api/orders/create-order",
        method: "POST",
        body: { courseId, payment_info, userId, couponCode },
        credentials: "include" as const,
      }),
    }),

    // Free course enrollment
    enrollFreeCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: "/api/v1/payment/enroll-free",
        method: "POST",
        body: { courseId },
        credentials: "include" as const,
      }),
    }),

    // Apply coupon code
    applyCoupon: builder.mutation({
      query: ({ code, courseId }) => ({
        url: "/api/v1/apply-coupon",
        method: "POST",
        body: { code, courseId },
        credentials: "include" as const,
      }),
    }),

  }),
});

export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useGetStripePublishAbleKeyQuery,
  useEnrollFreeCourseMutation,
  useApplyCouponMutation,
} = orderApi;