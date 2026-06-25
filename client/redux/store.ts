"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Bootstrap authentication on every page load.
 *
 * We call loadUser only. The baseQueryWithReauth wrapper in apiSlice.ts
 * automatically calls /refresh-token when it gets a 401 from /me, then
 * retries — so there's no need to call refreshToken here separately.
 *
 * forceRefetch: true guarantees a live server check even if RTK Query
 * has a stale cache entry from a previous session.
 */
const initializeApp = async () => {
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
  );
};

initializeApp();