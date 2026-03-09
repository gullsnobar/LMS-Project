import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Create coupon
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "create-coupon",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // Admin: Get all coupons
    getAllCoupons: builder.query({
      query: () => ({
        url: "get-coupons",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Admin: Update coupon
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `update-coupon/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // Admin: Delete coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `delete-coupon/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
