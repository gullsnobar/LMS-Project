import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000",
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query<any, void>({
            query: () => ({
                url: "/api/users/refresh-token",
                method: "POST",
                withCredentials: true,
            }),
        }),
        loadUser: builder.query<any, void>({
            query: () => ({
                url: "/api/users/me",
                method: "GET",
                withCredentials: true,
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn(data));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
