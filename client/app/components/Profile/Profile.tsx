"use client";
import { useEffect, useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
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

type Props = {
  user: any;
}

const Profile = ({ user }: Props) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState<any[]>([]);
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

 
  useEffect(() => {
    if (data) {
      const userCourseIds = new Set(
        user?.courses?.map((item: any) => item.courseId)
      );
      
      const filteredCourses = data.courses.filter((course: any) =>
        userCourseIds.has(course._id)
      );
      
      setCourses(filteredCourses);
    }

  }, [data, user]);



  const logOutHandler = async () => {
    try {
      await logoutUser(undefined).unwrap();
    } catch (err) {
      // Backend logout should now be resilient, but still don't block UI logout on errors.
      console.log("Logout request failed (continuing local logout):", err);
    } finally {
      dispatch(userLoggedOut());
      toast.success("Logged out successfully!");
      // End NextAuth session too (prevents automatic re-login on refresh)
      await signOut({ redirect: true, callbackUrl: "/" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-[#f5f5f5] bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000012] rounded-[5px] shadow-md dark:shadow-sm mt-20 mb-20 sticky ${scroll ? "top-[120px]" : "top-8"
          } left-8`}
      >
        {/* Sticky-Sidebar   */}
        <SideBarProfile
          user={user}
          active={active}
          setActive={setActive}
          avatar={avatar}
          logOutHandler={logOutHandler}
        />

      </div>
      <div className="w-full h-full bg-transparent mt-20">
        {active === 1 && <ProfileInfo user={user} avatar={avatar} />}
        {active === 2 && <ChangePassword />}
        {active === 3 && (
          <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 ">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} isProfile={true} />
                ))}
            </div>
            {courses.length === 0 && (
              <h1 className="text-center text-[18px] font-Poppins">
                You don't have any purchased courses!
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile;