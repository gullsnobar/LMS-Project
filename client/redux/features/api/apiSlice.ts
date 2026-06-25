import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000";

// ─── Base query with credentials ────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

// ─── Re-auth wrapper: on 401 try to refresh, then retry once ────────────────
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new access token using the refresh_token cookie
    const refreshResult = await baseQuery(
      { url: "/api/users/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new access token in Redux
      const data = refreshResult.data as any;
      if (data?.user) {
        api.dispatch(
          userLoggedIn({
            accessToken: data.accessToken || "",
            user: data.user,
          })
        );
      }
      // Retry the original request — the new accessToken cookie is now set
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh also failed — the user session is dead, log them out
      api.dispatch(userLoggedOut());
    }
  }

  return result;
};

// ─── API slice ───────────────────────────────────────────────────────────────
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.query<any, void>({
      query: () => ({
        url: "/api/users/refresh-token",
        method: "GET",
      }),
      // On success: update Redux with the refreshed token + user
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
          // Not logged in — silently ignore
        }
      },
    }),

    loadUser: builder.query<any, void>({
      query: () => ({
        url: "/api/users/me",
        method: "GET",
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
          // Not logged in — silently ignore
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
