"use client";

import React, { FC, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineAcademicCap,
  HiOutlineCurrencyDollar,
  HiOutlinePlayCircle,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
  HiOutlineChevronRight,
  HiOutlineBookOpen,
  HiOutlineRocketLaunch,
  HiOutlineCalendarDays,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChartBarSquare,
} from "react-icons/hi2";
import { useGetUserDashboardStatsQuery } from "../../../redux/features/dashboard/dashboardApi";
import { useGetUserOrdersQuery } from "../../../redux/features/dashboard/dashboardApi";
import Ratings from "../../utils/Ratings";

type Props = { user: any; setActiveTab: (tab: string) => void };

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  glow: string;
  delay: number;
}> = ({ icon, label, value, sub, gradient, glow, delay }) => (
  <div
    className="group relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500 mb-1.5">
          {label}
        </p>
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
          {value}
        </h3>
        {sub && (
          <div className="flex items-center gap-1 mt-2.5">
            <HiOutlineArrowTrendingUp size={13} className="text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-500">
              {sub}
            </span>
          </div>
        )}
      </div>
      <div
        className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-md ${glow}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

/* ─── Activity Item ────────────────────────────────────────── */
const ActivityItem: FC<{
  icon: React.ReactNode;
  text: string;
  time: string;
  color: string;
}> = ({ icon, text, time, color }) => (
  <div className="flex items-start gap-3 group">
    <div
      className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg ${color} flex items-center justify-center`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
        {text}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
        {time}
      </p>
    </div>
  </div>
);

/* ─── Quick Action ─────────────────────────────────────────── */
const QuickAction: FC<{
  href: string;
  title: string;
  desc: string;
  gradient: string;
  onClick?: () => void;
}> = ({ href, title, desc, gradient, onClick }) =>
  onClick ? (
    <button
      onClick={onClick}
      className={`text-left group p-5 ${gradient} rounded-2xl border border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
        {title}
      </h3>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </button>
  ) : (
    <Link
      href={href}
      className={`group p-5 ${gradient} rounded-2xl border border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
        {title}
      </h3>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </Link>
  );

/* ─── Main Component ───────────────────────────────────────── */
const DashboardOverview: FC<Props> = ({ user, setActiveTab }) => {
  const { data, isLoading } = useGetUserDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ordersData } = useGetUserOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const stats = data?.stats;
  const orders = ordersData?.orders || [];

  /* greeting */
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  /* recent activity from orders */
  const recentActivity = useMemo(() => {
    if (!orders.length) return [];
    return orders.slice(0, 4).map((o: any) => ({
      icon: (
        <HiOutlineCheckCircle size={15} className="text-emerald-600 dark:text-emerald-400" />
      ),
      text: `Enrolled in "${o.course?.name || "a course"}"`,
      time: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Recently",
      color:
        "bg-emerald-100 dark:bg-emerald-900/30",
    }));
  }, [orders]);

  /* learning streak (simulated from orders timing) */
  const streakDays = useMemo(() => {
    if (!orders.length) return 0;
    // simple: count days with at least 1 order in the last 7 days
    const now = Date.now();
    const days = new Set<number>();
    orders.forEach((o: any) => {
      const d = new Date(o.createdAt);
      const diff = Math.floor((now - d.getTime()) / 86400000);
      if (diff <= 7) days.add(diff);
    });
    return days.size;
  }, [orders]);

  /* loading skeleton */
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-gray-200 dark:bg-gray-800/60 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-800/60 rounded-2xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-72 bg-gray-200 dark:bg-gray-800/60 rounded-2xl" />
          <div className="h-72 bg-gray-200 dark:bg-gray-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ───── Welcome Banner ───── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f5576c] p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm font-medium tracking-wide">
              {greeting},
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
              Welcome back, {user?.name?.split(" ")[0] || "Learner"}!
            </h1>
            <p className="text-white/70 text-sm mt-2 max-w-md leading-relaxed">
              You have{" "}
              <span className="font-bold text-white">
                {stats?.enrolledCourses || 0} courses
              </span>{" "}
              enrolled and{" "}
              <span className="font-bold text-white">
                {stats?.totalLectures || 0} lectures
              </span>{" "}
              waiting for you. Keep the momentum going!
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#764ba2] hover:bg-white/90 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/10"
              >
                <HiOutlineRocketLaunch size={16} />
                Explore Courses
              </Link>
              {streakDays > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm font-semibold border border-white/20">
                  <HiOutlineFire size={16} className="text-amber-300" />
                  {streakDays}-day streak
                </div>
              )}
            </div>
          </div>

          {/* Mini avatar & date */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
              <Image
                src={user?.avatar?.url || user?.image || "/assets/avatar.png"}
                alt={user?.name || "User"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-bold">{user?.name || "User"}</p>
              <p className="text-[11px] text-white/60 flex items-center gap-1">
                <HiOutlineCalendarDays size={12} />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Stats Grid ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<HiOutlineAcademicCap size={22} className="text-white" />}
          label="Enrolled Courses"
          value={stats?.enrolledCourses || 0}
          sub="Active"
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          glow="shadow-blue-500/30"
          delay={0}
        />
        <StatCard
          icon={<HiOutlinePlayCircle size={22} className="text-white" />}
          label="Total Lectures"
          value={stats?.totalLectures || 0}
          sub={`${stats?.enrolledCourses || 0} courses`}
          gradient="bg-gradient-to-br from-violet-500 to-purple-700"
          glow="shadow-purple-500/30"
          delay={50}
        />
        <StatCard
          icon={<HiOutlineTrophy size={22} className="text-white" />}
          label="Certificates"
          value={stats?.certificates || 0}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          glow="shadow-amber-500/30"
          delay={100}
        />
        <StatCard
          icon={<HiOutlineCurrencyDollar size={22} className="text-white" />}
          label="Total Invested"
          value={`$${stats?.amountSpent || 0}`}
          sub={`${orders.length} orders`}
          gradient="bg-gradient-to-br from-emerald-500 to-green-700"
          glow="shadow-emerald-500/30"
          delay={150}
        />
      </div>

      {/* ───── Two-Column: Courses + Activity ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Enrolled Courses */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HiOutlineBookOpen
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  Recent Courses
                </h2>
                <p className="text-[11px] text-gray-400">
                  Continue where you left off
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("courses")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All <HiOutlineChevronRight size={12} />
            </button>
          </div>

          <div className="p-5">
            {stats?.courses && stats.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.courses.slice(0, 4).map((course: any, i: number) => (
                  <Link
                    key={course._id || i}
                    href={`/course-access/${course._id}`}
                    className="group flex gap-3.5 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 hover:border-blue-200 dark:hover:border-blue-800/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all duration-300"
                  >
                    <div className="w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={
                          course.thumbnail?.url ||
                          "/assets/course-placeholder.png"
                        }
                        alt={course.name}
                        width={72}
                        height={56}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Ratings rating={course.ratings || 0} />
                        <span className="text-[10px] text-gray-400">
                          • {course.courseData?.length || 0} lectures
                        </span>
                      </div>
                      <span className="inline-block mt-1.5 text-[10px] px-2 py-[2px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">
                        {course.level || "Beginner"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <HiOutlineAcademicCap
                  size={40}
                  className="mx-auto text-gray-300 dark:text-gray-700 mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  No Courses Yet
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Start your learning journey today.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                  Browse Courses <HiOutlineChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <HiOutlineClock
                  size={16}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                <p className="text-[11px] text-gray-400">Latest updates</p>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((a: any, i: number) => (
                <ActivityItem key={i} {...a} />
              ))
            ) : (
              <div className="text-center py-6">
                <HiOutlineClock
                  size={32}
                  className="mx-auto text-gray-300 dark:text-gray-700 mb-2"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Activity will appear here once you start learning.
                </p>
              </div>
            )}
          </div>

          {/* Streak / Performance Mini Section */}
          <div className="px-5 pb-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/40">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineChartBarSquare
                  size={16}
                  className="text-violet-600 dark:text-violet-400"
                />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Performance
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500">Courses Completed</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {stats?.certificates || 0}/{stats?.enrolledCourses || 0}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-1000"
                      style={{
                        width: `${
                          stats?.enrolledCourses
                            ? Math.round(
                                ((stats?.certificates || 0) /
                                  stats.enrolledCourses) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-500">Total Investment</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${stats?.amountSpent || 0}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-1000"
                      style={{ width: stats?.amountSpent ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Quick Actions ───── */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            href="/courses"
            title="Discover Courses"
            desc="Browse our expert-led course library"
            gradient="bg-blue-50/80 dark:bg-blue-900/10 hover:bg-blue-100/80 dark:hover:bg-blue-900/20"
          />
          <QuickAction
            href="#"
            onClick={() => setActiveTab("orders")}
            title="Order History"
            desc="View your purchase transactions"
            gradient="bg-purple-50/80 dark:bg-purple-900/10 hover:bg-purple-100/80 dark:hover:bg-purple-900/20"
          />
          <QuickAction
            href="#"
            onClick={() => setActiveTab("certificates")}
            title="Certificates"
            desc="Download your achievements"
            gradient="bg-amber-50/80 dark:bg-amber-900/10 hover:bg-amber-100/80 dark:hover:bg-amber-900/20"
          />
          <QuickAction
            href="/faq"
            title="Help Center"
            desc="Get answers to your questions"
            gradient="bg-emerald-50/80 dark:bg-emerald-900/10 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/20"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
