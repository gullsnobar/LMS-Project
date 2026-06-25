"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface ProtectedProps {
  children: React.ReactNode;
}

/**
 * Wraps any page that requires the user to be authenticated.
 *
 * Priority order:
 *  1. If Redux already has a user (e.g. just logged in) → render immediately.
 *  2. If the initial auth query is still in-flight               → render nothing
 *     (Custom.tsx shows the global loader above us).
 *  3. Query finished and still no user                           → redirect to /.
 */
export default function Protected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading } = useLoadUserQuery();

  // Fast path: user is already in Redux (just logged in or refreshed from cache)
  if (user) {
    return <>{children}</>;
  }

  // Auth check still in-flight — let Custom.tsx's Loader cover this
  if (isLoading) {
    return null;
  }

  // Auth check complete, no user found — send to home
  redirect("/");
}