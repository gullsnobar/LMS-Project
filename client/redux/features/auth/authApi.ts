import { apiSlice } from "../api/apiSlice";


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
                url: "register",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "login-user",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
        }),
        socialAuth: builder.mutation<any, SocialAuthData>({
            query: (data) => ({
                url: "social-auth",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "activate-user",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout-user",
                method: "GET",
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useActivationMutation, useSocialAuthMutation, useLogoutUserMutation } = authApi;
