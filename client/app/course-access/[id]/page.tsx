"use client";
import Loader from "../../components/Loader/Loader";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "../../components/Courses/CourseContent";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    if (!user || !user?._id) {
      router.replace("/");
      return;
    }
    const isPurchased = user?.courses?.find((item: any) => {
      const courseId = item?.courseId ?? item?._id ?? item;
      return courseId?.toString?.() === id?.toString?.();
    });
    if (!isPurchased) {
      router.replace("/");
    }
  }, [user, id, router]);
  return (
    <>
      {!user ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={user} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Page;