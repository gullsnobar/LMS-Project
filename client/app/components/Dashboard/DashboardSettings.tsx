"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineBell,
} from "react-icons/hi2";
import {
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
} from "../../../redux/features/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../../../redux/features/auth/authSlice";

type Props = {
  user: any;
};

const DashboardSettings: FC<Props> = ({ user }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editProfile, { isLoading: profileLoading }] = useEditProfileMutation();
  const [updatePassword, { isLoading: passwordLoading }] = useUpdatePasswordMutation();
  const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();

  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await editProfile({ name, email }).unwrap();
      if (result?.user) {
        dispatch(
          userLoggedIn({
            accessToken: token,
            user: result.user,
          })
        );
      }
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result: any = await updateAvatar({
          avatar: reader.result,
        }).unwrap();
        toast.success("Avatar updated successfully!");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to update avatar");
      }
    };
    reader.readAsDataURL(file);
  };

  const getAvatarUrl = () => {
    if (user?.avatar?.url) return user.avatar.url;
    return "/assets/avatar.png";
  };

  const sections = [
    { key: "profile", label: "Profile Info", icon: HiOutlineUser },
    { key: "security", label: "Security", icon: HiOutlineShieldCheck },
    { key: "notifications", label: "Notifications", icon: HiOutlineBell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeSection === section.key
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <Icon size={18} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeSection === "profile" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Avatar Section */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Picture
                </h2>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-blue-500/20 dark:ring-purple-500/20">
                      <Image
                        src={getAvatarUrl()}
                        alt={user?.name || "User"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <HiOutlineCamera size={24} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpdate}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Upload a new avatar
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Recommended: 400x400px, JPG or PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <HiOutlineUser
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <HiOutlineEnvelope
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        placeholder="Confirm new password"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>

              {/* Security Info */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Account Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <HiOutlineCheckCircle
                      size={20}
                      className="text-green-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        Email Verified
                      </p>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <HiOutlineShieldCheck
                      size={20}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Password Protected
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                        Your password is encrypted and secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Choose how you want to be notified
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Course Updates",
                    desc: "Get notified when courses you're enrolled in are updated",
                    defaultChecked: true,
                  },
                  {
                    title: "New Course Recommendations",
                    desc: "Receive recommendations based on your interests",
                    defaultChecked: true,
                  },
                  {
                    title: "Order Confirmations",
                    desc: "Get email confirmations for your purchases",
                    defaultChecked: true,
                  },
                  {
                    title: "Promotional Offers",
                    desc: "Receive special offers and discounts",
                    defaultChecked: false,
                  },
                  {
                    title: "Weekly Progress Report",
                    desc: "Get a weekly summary of your learning progress",
                    defaultChecked: false,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
