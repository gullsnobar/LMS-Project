import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000",
        credentials: "include",   // always send cookies with every request
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query<any, void>({
            query: () => ({
                url: "/api/users/refresh-token",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        loadUser: builder.query<any, void>({
            query: () => ({
                url: "/api/users/me",
                method: "GET",
                credentials: "include" as const,
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn(data));
                } catch (error) {
                    // Silently ignore — user is not logged in
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
