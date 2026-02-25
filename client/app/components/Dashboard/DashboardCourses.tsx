"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineAcademicCap,
  HiOutlinePlayCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";
import Ratings from "../../utils/Ratings";

type Props = {
  user: any;
};

const DashboardCourses: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      filterLevel === "all" || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You are enrolled in {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
        >
          Browse More
          <HiOutlineChevronRight size={16} />
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative">
          <HiOutlineFunnel
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course: any, index: number) => (
            <Link
              key={course._id || index}
              href={`/course-access/${course._id}`}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={course.thumbnail?.url || "/assets/course-placeholder.png"}
                  alt={course.name}
                  width={400}
                  height={220}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-lg">
                    Continue Learning →
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-lg">
                    {course.level || "Beginner"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug">
                  {course.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ratings rating={course.ratings || 0} />
                    <span className="text-xs text-gray-400">
                      ({course.ratings?.toFixed(1) || "0.0"})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <HiOutlinePlayCircle size={16} className="text-purple-500" />
                    <span className="text-xs font-medium">
                      {course.courseData?.length || 0} Lectures
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    Enrolled
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <HiOutlineAcademicCap
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterLevel !== "all"
              ? "No courses match your search"
              : "No Courses Yet"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || filterLevel !== "all"
              ? "Try adjusting your search or filters."
              : "Start your journey by enrolling in your first course."}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
          >
            Browse Courses
            <HiOutlineChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardCourses;
