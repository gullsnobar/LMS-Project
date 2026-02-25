"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import {
  HiOutlineTrophy,
  HiOutlineArrowDownTray,
  HiOutlineAcademicCap,
} from "react-icons/hi2";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";

type Props = {
  user: any;
};

const DashboardCertificates: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses && user?.courses) {
      const userCourseIds = new Set(
        user.courses.map((item: any) => item.courseId || item._id || item)
      );
      const filteredCourses = data.courses.filter((course: any) =>
        userCourseIds.has(course._id)
      );
      setCourses(filteredCourses);
    }
  }, [data, user]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Certificates
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {courses.length} certificate{courses.length !== 1 ? "s" : ""} earned
        </p>
      </div>

      {/* Certificates Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course: any, index: number) => (
            <div
              key={course._id || index}
              className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Certificate Decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-bl-[80px]" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/10 to-purple-500/10 rounded-tr-[40px]" />

              <div className="relative z-10 flex gap-4">
                {/* Trophy Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <HiOutlineTrophy size={28} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {course.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Certificate of Completion
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-semibold">
                      {course.level || "Beginner"}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-semibold">
                      Completed
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {course.courseData?.length || 0} lectures
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                      <HiOutlineArrowDownTray size={14} />
                      Download
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-all duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Thumbnail - small circle */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Image
                  src={course.thumbnail?.url || "/assets/course-placeholder.png"}
                  alt={course.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <HiOutlineTrophy
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Complete your enrolled courses to earn certificates and showcase your achievements.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardCertificates;
