"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineAcademicCap,
  HiOutlinePlayCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineChevronRight,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineClock,
  HiOutlineSignal,
  HiOutlineBookOpen,
} from "react-icons/hi2";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";
import Ratings from "../../utils/Ratings";

type Props = { user: any };

const DashboardCourses: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (data?.courses && user?.courses) {
      const ids = new Set(
        user.courses.map((c: any) => c.courseId || c._id || c)
      );
      setCourses(data.courses.filter((c: any) => ids.has(c._id)));
    }
  }, [data, user]);

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        const matchSearch = c.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchLevel =
          filterLevel === "all" || c.level === filterLevel;
        return matchSearch && matchLevel;
      }),
    [courses, searchTerm, filterLevel]
  );

  const levelCounts = useMemo(() => {
    const map: Record<string, number> = {
      all: courses.length,
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
    };
    courses.forEach((c) => {
      if (map[c.level] !== undefined) map[c.level]++;
    });
    return map;
  }, [courses]);

  /* loading */
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl w-60" />
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl flex-1" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 bg-gray-200 dark:bg-gray-800/60 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
            {filtered.length !== courses.length && ` • ${filtered.length} shown`}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Browse More <HiOutlineChevronRight size={14} />
        </Link>
      </div>

      {/* ── Filters Bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Level Filter */}
        <div className="relative">
          <HiOutlineFunnel
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="pl-10 pr-10 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Levels ({levelCounts.all})</option>
            <option value="Beginner">Beginner ({levelCounts.Beginner})</option>
            <option value="Intermediate">
              Intermediate ({levelCounts.Intermediate})
            </option>
            <option value="Advanced">Advanced ({levelCounts.Advanced})</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex items-center gap-1 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <HiOutlineSquares2X2 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <HiOutlineListBullet size={16} />
          </button>
        </div>
      </div>

      {/* ── Courses ──────────────────────────────── */}
      {filtered.length > 0 ? (
        viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((course: any, i: number) => (
              <Link
                key={course._id || i}
                href={`/course-access/${course._id}`}
                className="group bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 hover:border-blue-200 dark:hover:border-blue-800/60"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={
                      course.thumbnail?.url ||
                      "/assets/course-placeholder.png"
                    }
                    alt={course.name}
                    width={400}
                    height={220}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 shadow-lg flex items-center gap-1.5">
                      <HiOutlinePlayCircle size={14} />
                      Continue Learning
                    </span>
                  </div>
                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-lg ${
                        course.level === "Advanced"
                          ? "bg-red-500 text-white"
                          : course.level === "Intermediate"
                          ? "bg-amber-500 text-white"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      }`}
                    >
                      {course.level || "Beginner"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-[13px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <Ratings rating={course.ratings || 0} />
                    <span className="text-[11px] text-gray-400">
                      ({(course.ratings || 0).toFixed(1)})
                    </span>
                  </div>

                  {/* Progress bar placeholder */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        Enrolled
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <HiOutlinePlayCircle size={13} className="text-purple-500" />
                        {course.courseData?.length || 0} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock size={13} className="text-blue-500" />
                        {Math.ceil((course.courseData?.length || 0) * 0.5)}h
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <HiOutlineSignal size={12} /> Active
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filtered.map((course: any, i: number) => (
              <Link
                key={course._id || i}
                href={`/course-access/${course._id}`}
                className="group flex gap-4 p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/60 transition-all duration-300"
              >
                <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={
                      course.thumbnail?.url ||
                      "/assets/course-placeholder.png"
                    }
                    alt={course.name}
                    width={128}
                    height={96}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h3>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          course.level === "Advanced"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : course.level === "Intermediate"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {course.level || "Beginner"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Ratings rating={course.ratings || 0} />
                      <span className="text-[11px] text-gray-400">
                        ({(course.ratings || 0).toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <HiOutlinePlayCircle size={13} />
                        {course.courseData?.length || 0} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineClock size={13} />
                        ~{Math.ceil((course.courseData?.length || 0) * 0.5)}h
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      Continue <HiOutlineChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        /* Empty state */
        <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <HiOutlineBookOpen
              size={32}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {searchTerm || filterLevel !== "all"
              ? "No matching courses"
              : "No Courses Yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            {searchTerm || filterLevel !== "all"
              ? "Try adjusting your search or filters."
              : "Start your learning journey by exploring our course catalog."}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
          >
            Browse Courses <HiOutlineChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardCourses;
