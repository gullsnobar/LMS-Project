"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";

type Props = {
  children: ReactNode;
};

const Custom: FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  // isLoading is true only while the very first fetch is in-flight (no cached result yet).
  // isFetching is true on any fetch including background refetches.
  const { isLoading } = useLoadUserQuery();
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on the server — avoids hydration mismatches between
  // server-rendered HTML (no auth state) and the client's first paint.
  if (!mounted) return null;

  // Still waiting for the initial auth check AND there's no cached user —
  // show a full-page loader to avoid a flash of protected content.
  if (isLoading && !user) return <Loader />;

  return <>{children}</>;
};

export default Custom;
