"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineTrophy,
  HiOutlineArrowDownTray,
  HiOutlineAcademicCap,
  HiOutlineShare,
  HiOutlineCheckBadge,
  HiOutlinePlayCircle,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineStar,
} from "react-icons/hi2";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";

type Props = { user: any };

const DashboardCertificates: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses && user?.courses) {
      const ids = new Set(
        user.courses.map((c: any) => c.courseId || c._id || c)
      );
      setCourses(data.courses.filter((c: any) => ids.has(c._id)));
    }
  }, [data, user]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-800/60 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            My Certificates
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {courses.length} certificate{courses.length !== 1 ? "s" : ""}{" "}
            earned from course enrollment
          </p>
        </div>
        {courses.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <HiOutlineTrophy
              size={16}
              className="text-amber-600 dark:text-amber-400"
            />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {courses.length} Achievement{courses.length !== 1 ? "s" : ""}{" "}
              Unlocked
            </span>
          </div>
        )}
      </div>

      {/* ── Certificates Grid ────────────────────── */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course: any, i: number) => (
            <div
              key={course._id || i}
              className="group relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* ── Certificate Header Decorations ── */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-400/8 to-orange-500/8 rounded-bl-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/8 to-purple-500/8 rounded-tr-[60px] pointer-events-none" />

              {/* ── Certificate Pattern (watermark) ── */}
              <div className="absolute top-6 right-6 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
                <HiOutlineTrophy size={80} />
              </div>

              <div className="relative z-10 p-6">
                <div className="flex gap-4">
                  {/* Trophy / Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
                      <HiOutlineTrophy size={30} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                        {course.name}
                      </h3>
                      <HiOutlineCheckBadge
                        size={18}
                        className="flex-shrink-0 text-blue-500 mt-0.5"
                      />
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <HiOutlineStar
                        size={12}
                        className="text-amber-500"
                      />
                      Certificate of Completion
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          course.level === "Advanced"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : course.level === "Intermediate"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {course.level || "Beginner"}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-bold">
                        Completed
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <HiOutlinePlayCircle size={11} />
                        {course.courseData?.length || 0} lectures
                      </span>
                    </div>

                    {/* Issued date */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      Issued:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[11px] font-bold shadow-md hover:shadow-lg transition-all">
                    <HiOutlineArrowDownTray size={14} />
                    Download PDF
                  </button>
                  <Link
                    href={`/course-access/${course._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-[11px] font-semibold transition-all"
                  >
                    View Course
                  </Link>
                  <button className="ml-auto p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <HiOutlineSparkles size={16} />
                  </button>
                </div>
              </div>

              {/* Course Thumbnail on hover */}
              <div className="absolute top-4 right-4 w-11 h-11 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-90">
                <Image
                  src={
                    course.thumbnail?.url ||
                    "/assets/course-placeholder.png"
                  }
                  alt={course.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
            <HiOutlineTrophy
              size={40}
              className="text-amber-400 dark:text-amber-500"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-5 leading-relaxed">
            Complete your enrolled courses to earn certificates and showcase
            your achievements to the world.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
          >
            Start Learning <HiOutlineChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardCertificates;
