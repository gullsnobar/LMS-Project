"use client";

import Link from "next/link";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BiUser, BiLogOut } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import CustomModal from "../utils/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import { useSocialAuthMutation } from "../../redux/features/auth/authApi";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  activeItem?: number;
  setActiveItem?: (item: number) => void;
  route?: string;
  setRoute?: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem: activeItemProp, setOpen: setOpenProp, route: routeProp, open: openProp, setRoute: setRouteProp }) => {
  const [activeItemState, setActiveItemState] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpenState, setMenuOpenState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [routeState, setRouteState] = useState<"Login" | "Sign-Up" | "Verification">("Login");

  const activeItem = activeItemProp ?? activeItemState;
  const route = routeProp ?? routeState;
  const menuOpen = openProp ?? menuOpenState;

  const setRoute = (r: string) => {
    setRouteState(r as any);
    if (setRouteProp) setRouteProp(r);
  };

  const setMenuOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(menuOpen) : value;
    setMenuOpenState(newValue);
    if (setOpenProp) setOpenProp(newValue);
  };


  // Get user from Redux
  const { user } = useSelector((state: any) => state.auth);

  // Also check NextAuth session as fallback
  const { data: session } = useSession();

  // Social auth mutation
  const [socialAuth, { isSuccess: socialAuthSuccess }] = useSocialAuthMutation();

  // Use either Redux user or NextAuth session user
  const currentUser = user || session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (session) {
      setModalOpen(false);
      setRoute("Login");
    }
  }, [session]);

  // Handle social authentication
  useEffect(() => {
    if (!user && session?.user) {
      socialAuth({
        email: session.user.email || "",
        name: session.user.name || "",
        avatar: session.user.image || "",
      });
    }
  }, [user, session, socialAuth]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileDropdown(false);
    await signOut();
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (currentUser?.avatar?.url) return currentUser.avatar.url;
    if (currentUser?.image) return currentUser.image;
    return "/assets/avatar.png";
  };

  return (
    <header className="w-full relative">
      {/* Navbar */}
      <div
        className={`${scrolled
          ? "fixed top-0 left-0 w-full h-[80px] z-[80] border-b border-[#0000000c] dark:border-[#ffffff1c] shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-300"
          : "w-full h-[80px] z-[80] border-b border-[#0000000c] dark:border-[#ffffff1c] shadow-sm bg-white dark:bg-black"
          }`}
      >
        <div className="w-[95%] md:w-[92%] mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-[27px] font-poppins font-bold text-black dark:text-white"
          >
            ELearning
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems activeItem={activeItem} isMobile={false} />
            <ThemeSwitcher />

            {/* User Profile or Login Icon */}
            {currentUser ? (
              <div className="relative profile-dropdown">
                <div
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-purple-500 transition-all duration-200 shadow-md overflow-hidden"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <Image
                    src={getAvatarUrl()}
                    alt={currentUser.name || "User"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    priority
                    unoptimized={getAvatarUrl().startsWith("http")}
                  />
                </div>

                {/* Dropdown Menu */}
                {profileDropdown && (
                  <div className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {currentUser.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {currentUser.email || "user@example.com"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <BiUser size={18} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <MdDashboard size={18} />
                      <span>My Dashboard</span>
                    </Link>

                    {currentUser.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileDropdown(false)}
                      >
                        <MdDashboard size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700 mt-1 pt-2"
                    >
                      <BiLogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer text-black dark:text-white hover:text-blue-600 dark:hover:text-purple-500 transition-colors duration-200"
                onClick={() => {
                  setRoute("Login");
                  setModalOpen(true);
                }}
              />
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeSwitcher />

            {/* User Profile or Login Icon - Mobile */}
            {currentUser ? (
              <div className="relative profile-dropdown">
                <div
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-purple-500 transition-all duration-200 shadow-md overflow-hidden"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <Image
                    src={getAvatarUrl()}
                    alt={currentUser.name || "User"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    priority
                    unoptimized={getAvatarUrl().startsWith("http")}
                  />
                </div>

                {/* Mobile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {currentUser.name || "User"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {currentUser.email || "user@example.com"}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <BiUser size={16} />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <MdDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>

                    {currentUser.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileDropdown(false)}
                      >
                        <MdDashboard size={16} />
                        <span>Admin</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700 mt-1 pt-2"
                    >
                      <BiLogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer text-black dark:text-white hover:text-blue-600 dark:hover:text-purple-500 transition-colors duration-200"
                onClick={() => {
                  setRoute("Login");
                  setModalOpen(true);
                }}
              />
            )}

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-black dark:text-white text-[26px]"
              aria-label="Open Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[80px] left-0 w-full bg-white dark:bg-black z-40 shadow-md p-5 md:hidden">
          <NavItems activeItem={activeItem} isMobile />
        </div>
      )}

      {/* Modal */}
      <CustomModal open={modalOpen} setOpen={setModalOpen}>
        {route === "Login" ? (
          <Login setRoute={(r) => setRoute(r)} setOpen={setModalOpen} />
        ) : route === "Sign-Up" ? (
          <SignUp
            setRoute={(r: "Login" | "Sign-Up" | "Verification") => setRoute(r)}
            setOpen={setModalOpen}
          />
        ) : (
          <Verification
            setRoute={(r: "Login" | "Sign-Up" | "Verification") => setRoute(r)}
            setOpen={setModalOpen}
          />
        )}
      </CustomModal>
    </header>
  );
};

export default Header;