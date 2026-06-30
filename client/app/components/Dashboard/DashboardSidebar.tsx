"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useLogoutUserMutation } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../../redux/features/auth/authSlice";
import toast from "react-hot-toast";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const menuItems = [
  { key: "overview",      label: "Overview" },
  { key: "courses",       label: "My Courses" },
  { key: "orders",        label: "Order History" },
  { key: "certificates", label: "Certificates" },
  { key: "settings",      label: "Settings" },
];

const DashboardSidebar: FC<Props> = ({
  activeTab,
  setActiveTab,
  user,
  collapsed,
  setCollapsed,
}) => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
    } catch (_err) {}
    dispatch(userLoggedOut());
    toast.success("Logged out successfully!");
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const avatarUrl =
    user?.avatar?.url || user?.image || "/assets/avatar.png";

  const courseCount = user?.courses?.length || 0;

  const sidebarContent = (
    <>
      {/* ── User Profile ─────────────────────────── */}
      <div
        className={`p-4 ${
          collapsed ? "px-3" : ""
        } border-b border-gray-100 dark:border-gray-800/60`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/30 dark:ring-purple-500/30 shadow-md">
              <Image
                src={avatarUrl}
                alt={user?.name || "User"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0d1322]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </div>

        {/* Mini stats under profile */}
        {!collapsed && (
          <div className="flex items-center gap-3 mt-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
            <div className="flex-1 text-center">
              <p className="text-xs font-extrabold text-gray-900 dark:text-white">
                {courseCount}
              </p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                Courses
              </p>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 text-center">
              <p className="text-xs font-extrabold text-gray-900 dark:text-white">
                {courseCount}
              </p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                Certs
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-600">
            Menu
          </p>
        )}
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center ${
                collapsed ? "justify-center px-2" : "px-4"
              } py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-600/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator dot when collapsed */}
              {collapsed && isActive && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
              {collapsed && !isActive && (
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
              )}

              {!collapsed && <span>{item.label}</span>}

              {/* collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl font-medium">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Upgrade CTA (only when expanded) ───── */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/15 dark:to-purple-900/15 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-1.5">
              <HiOutlineSparkles
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                Keep Learning
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
              Explore new courses and level up your skills today.
            </p>
            <Link
              href="/courses"
              className="block text-center w-full py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] font-bold rounded-lg hover:shadow-md transition-all"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      )}

      {/* ── Bottom Actions ───────────────────────── */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800/60 space-y-1">
        {collapsed && (
          <Link
            href="/courses"
            className="flex items-center justify-center px-2 py-2.5 rounded-xl text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            title="Browse Courses"
          >
            <HiOutlineAcademicCap size={19} />
          </Link>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center px-2" : "px-4"
          } py-2.5 rounded-xl text-[13px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-all duration-200`}
          title={collapsed ? "Logout" : undefined}
        >
          {collapsed ? (
            <span className="w-2 h-2 rounded-full bg-red-400" />
          ) : (
            <span>Logout</span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Toggle ──────────────────────── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 left-6 z-[100] lg:hidden w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        {mobileOpen ? (
          <HiOutlineXMark size={22} />
        ) : (
          <HiOutlineBars3 size={22} />
        )}
      </button>

      {/* ── Mobile Overlay ─────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────── */}
      <aside
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white dark:bg-[#0d1322] border-r border-gray-200/60 dark:border-gray-800/60 flex flex-col transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] z-[95] ${
          mobileOpen
            ? "translate-x-0 w-[272px] shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[84px]" : "lg:w-[272px]"}`}
      >
        {sidebarContent}

        {/* ── Desktop Collapse Toggle ──────────── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 bg-white dark:bg-[#1a2234] border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all z-10"
        >
          {collapsed ? (
            <HiOutlineChevronRight
              size={13}
              className="text-gray-500 dark:text-gray-400"
            />
          ) : (
            <HiOutlineChevronLeft
              size={13}
              className="text-gray-500 dark:text-gray-400"
            />
          )}
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
