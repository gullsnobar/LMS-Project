"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineCreditCard,
  HiOutlineCog6Tooth,
  HiOutlineTrophy,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowRightOnRectangle,
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
  { key: "overview", label: "Overview", icon: HiOutlineHome },
  { key: "courses", label: "My Courses", icon: HiOutlineAcademicCap },
  { key: "orders", label: "Order History", icon: HiOutlineCreditCard },
  { key: "certificates", label: "Certificates", icon: HiOutlineTrophy },
  { key: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
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

  const getAvatarUrl = () => {
    if (user?.avatar?.url) return user.avatar.url;
    if (user?.image) return user.image;
    return "/assets/avatar.png";
  };

  const sidebarContent = (
    <>
      {/* User Profile Section */}
      <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${collapsed ? "px-2" : ""}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/30 dark:ring-purple-500/30">
              <Image
                src={getAvatarUrl()}
                alt={user?.name || "User"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center ${
                collapsed ? "justify-center px-2" : "px-3"
              } py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className={isActive ? "text-white" : ""} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <Link
          href="/courses"
          className={`flex items-center ${
            collapsed ? "justify-center px-2" : "px-3"
          } py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200`}
          title={collapsed ? "Browse Courses" : undefined}
        >
          <HiOutlineAcademicCap size={20} />
          {!collapsed && <span className="ml-3">Browse Courses</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center px-2" : "px-3"
          } py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200`}
          title={collapsed ? "Logout" : undefined}
        >
          <HiOutlineArrowRightOnRectangle size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 left-6 z-[100] lg:hidden w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <HiOutlineHome size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-[95] ${
          mobileOpen
            ? "translate-x-0 w-[280px]"
            : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[80px]" : "lg:w-[280px]"}`}
      >
        {sidebarContent}

        {/* Collapse Toggle - Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
        >
          {collapsed ? (
            <HiOutlineChevronRight size={12} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <HiOutlineChevronLeft size={12} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
