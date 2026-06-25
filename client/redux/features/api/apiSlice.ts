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
            // When refresh succeeds the server sets a new accessToken cookie
            // and returns { success, message, accessToken }
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.accessToken) {
                        // We don't have a user object here — loadUser will supply it
                        dispatch(userLoggedIn({ accessToken: data.accessToken, user: null }));
                    }
                } catch {
                    // Refresh failed — user is not logged in, ignore silently
                }
            },
        }),
        loadUser: builder.query<any, void>({
            query: () => ({
                url: "/api/users/me",
                method: "GET",
                credentials: "include" as const,
            }),
            // /api/users/me returns { success, user }
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.user) {
                        dispatch(
                            userLoggedIn({
                                accessToken: data.accessToken || "",
                                user: data.user,
                            })
                        );
                    }
                } catch {
                    // Silently ignore — user is not logged in
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

