import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

type RegistrationResponse = {
    message: string;
    activationToken: string;
};

type RegistrationData = {
    name: string;
    email: string;
    password: string;
};
type SocialAuthData = {
    name: string;
    email: string;
    avatar: string;
};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "/api/users/register",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "/api/users/login-user",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
            // Populate Redux state immediately after login succeeds.
            // This ensures Protected components see auth.user before loadUser re-fires.
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
                        // Also update the loadUser cache so Protected sees isLoading=false + user set
                        dispatch(
                            apiSlice.util.upsertQueryData("loadUser" as any, undefined, data)
                        );
                    }
                } catch {
                    // Login failed — error handled in component
                }
            },
        }),
        socialAuth: builder.mutation<any, SocialAuthData>({
            query: (data) => ({
                url: "/api/users/social-auth",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
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
                        dispatch(
                            apiSlice.util.upsertQueryData("loadUser" as any, undefined, data)
                        );
                    }
                } catch {
                    // ignore
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "/api/users/activate-user",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/api/users/logout-user",
                method: "GET",
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useActivationMutation, useSocialAuthMutation, useLogoutUserMutation } = authApi;
