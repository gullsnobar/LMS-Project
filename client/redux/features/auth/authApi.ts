"use client";

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

/**
 * Shared helper: after a successful login or social-auth response,
 * populate Redux auth state AND update the loadUser RTK Query cache
 * so any component subscribed to useLoadUserQuery() immediately sees
 * the authenticated user without making another network round-trip.
 */
const handleAuthSuccess = (dispatch: any, data: any) => {
  if (!data?.user) return;

  // 1. Populate Redux auth state
  dispatch(
    userLoggedIn({
      accessToken: data.accessToken || "",
      user: data.user,
    })
  );

  // 2. Inject the user into the loadUser cache so Protected components
  //    see isLoading=false + user set immediately on navigation to /dashboard
  dispatch(
    apiSlice.util.updateQueryData("loadUser" as never, undefined as never, (draft: any) => {
      Object.assign(draft, { success: true, user: data.user });
    })
  );
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
      // Immediately populate Redux + cache so Protected renders without delay
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(dispatch, data);
        } catch {
          // Login failed — error handled in the Login component via isError
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
          handleAuthSuccess(dispatch, data);
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
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useActivationMutation,
  useSocialAuthMutation,
  useLogoutUserMutation,
} = authApi;
