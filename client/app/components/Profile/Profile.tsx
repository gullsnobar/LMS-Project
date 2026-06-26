"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutUserMutation } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import toast from "react-hot-toast";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Courses/CourseCard";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/courseApi";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../../redux/features/auth/authSlice";
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
} from "react-icons/hi2";

type Props = { user: any };

const Profile = ({ user }: Props) => {
  const [active, setActive] = useState(1);
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState<any[]>([]);
  const { data } = useGetUsersAllCoursesQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const userCourseIds = new Set(
        user?.courses?.map((item: any) => item.courseId)
      );
      setCourses(data.courses.filter((c: any) => userCourseIds.has(c._id)));
    }
  }, [data, user]);

  const logOutHandler = async () => {
    try {
      await logoutUser(undefined).unwrap();
    } catch {
      // continue regardless
    } finally {
      dispatch(userLoggedOut());
      toast.success("Logged out successfully!");
      await signOut({ redirect: true, callbackUrl: "/" });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1322]">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
        {/* decorative orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <HiOutlineSparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-white/70 text-sm mt-0.5">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">

          {/* ── Sticky Sidebar ─────────────────────── */}
          <div
            className={`hidden md:block w-72 flex-shrink-0 sticky ${
              scroll ? "top-[90px]" : "top-6"
            } transition-all duration-300`}
          >
            <SideBarProfile
              user={user}
              active={active}
              setActive={setActive}
              avatar={avatar}
              logOutHandler={logOutHandler}
              coursesCount={courses.length}
            />
          </div>

          {/* ── Main Content ───────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Mobile tab bar */}
            <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { id: 1, label: "Profile" },
                { id: 2, label: "Password" },
                { id: 3, label: "Courses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {active === 1 && <ProfileInfo user={user} avatar={avatar} />}
            {active === 2 && <ChangePassword />}
            {active === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <HiOutlineAcademicCap size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Enrolled Courses
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
                    </p>
                  </div>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((item: any, index: number) => (
                      <CourseCard item={item} key={index} isProfile={true} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                      <HiOutlineAcademicCap
                        size={36}
                        className="text-blue-500 dark:text-blue-400"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      No courses yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                      You haven&apos;t enrolled in any courses. Browse our catalog to get started.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;