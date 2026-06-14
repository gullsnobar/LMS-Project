import { apiSlice } from "../api/apiSlice";
export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLayout: builder.mutation({
      query: ({ data }) => ({
        url: "/api/layout/create-layout",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getHeroData: builder.query({
      query: (type: string) => ({
        url: `/api/layout/get-layout/${type}`,
        method: "GET",
      }),
    }),

    editLayout: builder.mutation({
      query: ({ type, image, title, subTitle, faq, categories }) => ({
        url: `/api/layout/edit-layout`,
        method: "PUT",
        body: {
          type,
          image,
          title,
          subTitle,
          faq,
          categories,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateLayoutMutation,
  useEditLayoutMutation,
  useGetHeroDataQuery,
} = layoutApi;