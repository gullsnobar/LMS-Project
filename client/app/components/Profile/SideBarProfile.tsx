"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import avatarDefault from "../../../public/assetes/avatardefault.jpg";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineAcademicCap,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
} from "react-icons/hi2";

type SideBarProfileProps = {
  user: any;
  active: number;
  setActive: (active: number) => void;
  avatar: string | null;
  logOutHandler: any;
  coursesCount?: number;
};

const menuItems = [
  { id: 1, label: "My Profile", icon: HiOutlineUser, description: "Personal information" },
  { id: 2, label: "Change Password", icon: HiOutlineLockClosed, description: "Security settings" },
  { id: 3, label: "Enrolled Courses", icon: HiOutlineAcademicCap, description: "Your learning" },
];

const SideBarProfile = ({
  user,
  active,
  setActive,
  avatar,
  logOutHandler,
  coursesCount = 0,
}: SideBarProfileProps) => {
  const avatarUrl =
    user?.avatar?.url || avatar || avatarDefault;

  const joinedYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">

      {/* ── User Hero ──────────────────────────── */}
      <div className="relative px-5 pt-8 pb-5 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/15 dark:via-purple-900/15 dark:to-indigo-900/15 border-b border-gray-100 dark:border-gray-800/60">
        {/* background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10" />

        <div className="relative flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl shadow-blue-500/20">
              <Image
                src={avatarUrl}
                alt={user?.name || "User"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            {/* online dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* Name */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
            {user?.name || "User"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px]">
            {user?.email || "user@example.com"}
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-3">
            {user?.role === "admin" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold shadow-sm">
                <HiOutlineShieldCheck size={10} />
                Admin
              </span>
            )}
            {user?.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                <HiOutlineCheckBadge size={10} />
                Verified
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-semibold">
              Since {joinedYear}
            </span>
          </div>

          {/* Stat strip */}
          <div className="flex items-center gap-4 mt-4 w-full justify-center">
            <div className="flex flex-col items-center">
              <span className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">
                {coursesCount}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                Courses
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">
                {coursesCount}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                Certs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────── */}
      <nav className="p-3 space-y-1">
        <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-600">
          Account
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-600/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold leading-none ${isActive ? "text-white" : ""}`}>
                  {item.label}
                </p>
                <p className={`text-[10px] mt-0.5 leading-none ${isActive ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}>
                  {item.description}
                </p>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
              )}
            </button>
          );
        })}

        {/* Admin link */}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 group-hover:from-blue-200 dark:group-hover:from-blue-900/60 transition-all">
              <HiOutlineShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-none">Admin Panel</p>
              <p className="text-[10px] mt-0.5 leading-none text-gray-400 dark:text-gray-500">
                Manage platform
              </p>
            </div>
          </Link>
        )}
      </nav>

      {/* ── Upgrade CTA ────────────────────────── */}
      <div className="px-3 pb-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/15 dark:to-purple-900/15 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-1.5">
            <HiOutlineSparkles size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-white">
              Keep Learning
            </span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2.5">
            Explore new courses and level up your skills today.
          </p>
          <Link
            href="/courses"
            className="block w-full text-center text-[11px] font-bold py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity"
          >
            Browse Courses →
          </Link>
        </div>
      </div>

      {/* ── Logout ─────────────────────────────── */}
      <div className="px-3 pb-3">
        <button
          onClick={logOutHandler}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-100 dark:border-red-900/30"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all">
            <HiOutlineArrowRightOnRectangle size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none">Sign Out</p>
            <p className="text-[10px] mt-0.5 leading-none text-red-400/70 dark:text-red-500/60">
              End your session
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideBarProfile;