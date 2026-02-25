"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineAcademicCap,
  HiOutlineCreditCard,
  HiOutlineCurrencyDollar,
  HiOutlinePlayCircle,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
  HiOutlineClock,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useGetUserDashboardStatsQuery } from "../../../redux/features/dashboard/dashboardApi";
import Ratings from "../../utils/Ratings";

type Props = {
  user: any;
};

const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  gradient: string;
  iconBg: string;
}> = ({ icon, label, value, trend, gradient, iconBg }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${gradient} opacity-10 rounded-bl-[60px] group-hover:opacity-20 transition-opacity`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <HiOutlineArrowTrendingUp size={14} className="text-green-500" />
            <span className="text-xs font-medium text-green-500">{trend}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardOverview: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUserDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const stats = data?.stats;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium mb-1">
            {getGreeting()},
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {user?.name || "Learner"} 👋
          </h1>
          <p className="text-blue-100 text-sm max-w-lg">
            Continue your learning journey. You have{" "}
            <span className="font-bold text-white">
              {stats?.enrolledCourses || 0} courses
            </span>{" "}
            enrolled. Keep up the great work!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold transition-all duration-200 border border-white/20"
          >
            Explore More Courses
            <HiOutlineChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<HiOutlineAcademicCap size={24} className="text-white" />}
          label="Enrolled Courses"
          value={stats?.enrolledCourses || 0}
          trend="Active"
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
        />
        <StatCard
          icon={<HiOutlinePlayCircle size={24} className="text-white" />}
          label="Total Lectures"
          value={stats?.totalLectures || 0}
          gradient="bg-gradient-to-br from-purple-400 to-purple-600"
          iconBg="bg-gradient-to-br from-purple-500 to-purple-700"
        />
        <StatCard
          icon={<HiOutlineTrophy size={24} className="text-white" />}
          label="Certificates"
          value={stats?.certificates || 0}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          iconBg="bg-gradient-to-br from-amber-500 to-amber-700"
        />
        <StatCard
          icon={<HiOutlineCurrencyDollar size={24} className="text-white" />}
          label="Total Invested"
          value={`$${stats?.amountSpent || 0}`}
          gradient="bg-gradient-to-br from-green-400 to-green-600"
          iconBg="bg-gradient-to-br from-green-500 to-green-700"
        />
      </div>

      {/* Recently Enrolled Courses */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              My Courses
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Continue where you left off
            </p>
          </div>
          <Link
            href="/courses"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All <HiOutlineChevronRight size={14} />
          </Link>
        </div>
        <div className="p-5">
          {stats?.courses && stats.courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {stats.courses.slice(0, 6).map((course: any, index: number) => (
                <Link
                  key={course._id || index}
                  href={`/course-access/${course._id}`}
                  className="group flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={course.thumbnail?.url || "/assets/course-placeholder.png"}
                      alt={course.name}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Ratings rating={course.ratings || 0} />
                      <span className="text-xs text-gray-400">
                        {course.courseData?.length || 0} lectures
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                        {course.level || "Beginner"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiOutlineAcademicCap
                size={48}
                className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Courses Yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start your learning journey by enrolling in a course.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
              >
                Browse Courses
                <HiOutlineChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/courses"
          className="group p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300"
        >
          <HiOutlineAcademicCap
            size={28}
            className="text-blue-600 dark:text-blue-400 mb-3"
          />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Discover Courses
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Browse our library of expert-led courses
          </p>
        </Link>
        <Link
          href="/profile"
          className="group p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300"
        >
          <HiOutlineClock
            size={28}
            className="text-purple-600 dark:text-purple-400 mb-3"
          />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            My Profile
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Update your profile and preferences
          </p>
        </Link>
        <Link
          href="/faq"
          className="group p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800/50 hover:shadow-lg transition-all duration-300"
        >
          <HiOutlineCreditCard
            size={28}
            className="text-green-600 dark:text-green-400 mb-3"
          />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Help Center
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Get answers to your questions
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardOverview;
