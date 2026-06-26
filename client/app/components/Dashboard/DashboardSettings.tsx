"use client";

import React, { FC, useState, useCallback } from "react";
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
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationTriangle,
  HiOutlineTrash,
  HiOutlineKey,
  HiOutlineFingerPrint,
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
} from "react-icons/hi2";
import {
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
} from "../../../redux/features/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../../../redux/features/auth/authSlice";

type Props = { user: any };

const DashboardSettings: FC<Props> = ({ user }) => {
  const [activeSection, setActiveSection] = useState("profile");

  /* profile */
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  /* password */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [editProfile, { isLoading: profileLoading }] =
    useEditProfileMutation();
  const [updatePassword, { isLoading: passwordLoading }] =
    useUpdatePasswordMutation();
  const [updateAvatar, { isLoading: avatarLoading }] =
    useUpdateAvatarMutation();

  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);

  /* handlers */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await editProfile({ name, email }).unwrap();
      if (result?.user) {
        dispatch(userLoggedIn({ accessToken: token, user: result.user }));
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

  const handleAvatarUpdate = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await updateAvatar({ avatar: reader.result }).unwrap();
          toast.success("Avatar updated!");
        } catch (err: any) {
          toast.error(err?.data?.message || "Failed to update avatar");
        }
      };
      reader.readAsDataURL(file);
    },
    [updateAvatar]
  );

  const avatarUrl = user?.avatar?.url || "/assets/avatar.png";

  /* password strength */
  const getStrength = (pw: string) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1)
      return { level: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 3)
      return { level: 2, label: "Medium", color: "bg-amber-500" };
    return { level: 3, label: "Strong", color: "bg-emerald-500" };
  };
  const strength = getStrength(newPassword);

  const sections = [
    { key: "profile", label: "Profile", icon: HiOutlineUser },
    { key: "security", label: "Security", icon: HiOutlineShieldCheck },
    {
      key: "notifications",
      label: "Notifications",
      icon: HiOutlineBell,
    },
    {
      key: "sessions",
      label: "Sessions",
      icon: HiOutlineFingerPrint,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings, security, and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Settings Navigation ────────────────── */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-2.5 shadow-sm sticky top-[140px]">
            <nav className="space-y-0.5">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      activeSection === section.key
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={17} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Settings Content ───────────────────── */}
        <div className="flex-1 space-y-6">
          {/* ═══ PROFILE ═══ */}
          {activeSection === "profile" && (
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">
              {/* Avatar Section */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800/60">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Profile Picture
                </h2>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-blue-500/15 dark:ring-purple-500/15 shadow-lg">
                      <Image
                        src={avatarUrl}
                        alt={user?.name || "User"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      {avatarLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiOutlineCamera
                          size={22}
                          className="text-white"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpdate}
                        className="hidden"
                        disabled={avatarLoading}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Upload a new avatar
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Recommended: 400×400px, JPG or PNG, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form
                onSubmit={handleProfileUpdate}
                className="p-6 space-y-5"
              >
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                      <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400">
                        <HiOutlineUser size={16} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                      <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400">
                        <HiOutlineEnvelope size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
                  >
                    {profileLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══ SECURITY ═══ */}
          {activeSection === "security" && (
            <div className="space-y-6">
              {/* Password Change */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">
                <form
                  onSubmit={handlePasswordUpdate}
                  className="p-6 space-y-5"
                >
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Change Password
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Use a strong password with at least 8 characters
                    </p>
                  </div>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Current Password
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                        <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400">
                          <HiOutlineLockClosed size={16} />
                        </span>
                        <input
                          type={showOld ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="flex-1 min-w-0 bg-transparent py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOld(!showOld)}
                          className="flex-shrink-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showOld ? (
                            <HiOutlineEyeSlash size={16} />
                          ) : (
                            <HiOutlineEye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        New Password
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                        <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400">
                          <HiOutlineLockClosed size={16} />
                        </span>
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 min-w-0 bg-transparent py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                          placeholder="Enter new password"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="flex-shrink-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNew ? (
                            <HiOutlineEyeSlash size={16} />
                          ) : (
                            <HiOutlineEye size={16} />
                          )}
                        </button>
                      </div>
                      {/* Password strength meter */}
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all ${
                                  level <= strength.level
                                    ? strength.color
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <p
                            className={`text-[10px] font-semibold ${
                              strength.level === 1
                                ? "text-red-500"
                                : strength.level === 2
                                ? "text-amber-500"
                                : "text-emerald-500"
                            }`}
                          >
                            {strength.label}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className={`flex items-center rounded-xl border bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-400 focus-within:border-red-500"
                          : confirmPassword && confirmPassword === newPassword
                          ? "border-emerald-400 focus-within:border-emerald-500"
                          : "border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500"
                      }`}>
                        <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400">
                          <HiOutlineLockClosed size={16} />
                        </span>
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          className="flex-1 min-w-0 bg-transparent py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                          placeholder="Confirm new password"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="flex-shrink-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirm ? (
                            <HiOutlineEyeSlash size={16} />
                          ) : (
                            <HiOutlineEye size={16} />
                          )}
                        </button>
                      </div>
                      {confirmPassword &&
                        confirmPassword !== newPassword && (
                          <p className="text-[10px] text-red-500 font-medium mt-1">
                            Passwords don&apos;t match
                          </p>
                        )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
                  >
                    {passwordLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating…
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </div>

              {/* Security Status */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Account Security Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <HiOutlineCheckCircle
                      size={18}
                      className="text-emerald-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        Email Verified
                      </p>
                      <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/15 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <HiOutlineShieldCheck
                      size={18}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Password Protected
                      </p>
                      <p className="text-[10px] text-blue-600/60 dark:text-blue-400/60">
                        Your password is encrypted and secure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/15 rounded-xl border border-amber-100 dark:border-amber-800/30">
                    <HiOutlineKey
                      size={18}
                      className="text-amber-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                        Two-Factor Authentication
                      </p>
                      <p className="text-[10px] text-amber-600/60 dark:text-amber-400/60">
                        Not enabled — enable for extra security
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-red-200 dark:border-red-900/40 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineExclamationTriangle
                    size={18}
                    className="text-red-500"
                  />
                  <h3 className="text-base font-bold text-red-600 dark:text-red-400">
                    Danger Zone
                  </h3>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
                  Once you delete your account, there is no going back.
                  Please be certain.
                </p>
                <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5">
                  <HiOutlineTrash size={14} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* ═══ NOTIFICATIONS ═══ */}
          {activeSection === "notifications" && (
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden p-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Notification Preferences
              </h2>
              <p className="text-[11px] text-gray-400 mb-6">
                Choose how you want to be notified
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Course Updates",
                    desc: "Get notified when your enrolled courses are updated",
                    icon: HiOutlineAcademicCap,
                    defaultChecked: true,
                  },
                  {
                    title: "New Course Recommendations",
                    desc: "Receive personalized recommendations based on your interests",
                    icon: HiOutlineGlobeAlt,
                    defaultChecked: true,
                  },
                  {
                    title: "Order Confirmations",
                    desc: "Get email confirmations for your purchases",
                    icon: HiOutlineCheckCircle,
                    defaultChecked: true,
                  },
                  {
                    title: "Promotional Offers",
                    desc: "Receive special offers and discount codes",
                    icon: HiOutlineBell,
                    defaultChecked: false,
                  },
                  {
                    title: "Weekly Progress Report",
                    desc: "Get a weekly summary of your learning",
                    icon: HiOutlineFingerPrint,
                    defaultChecked: false,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200/80 dark:bg-gray-700/50 flex items-center justify-center">
                          <Icon
                            size={15}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:shadow-sm after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600" />
                      </label>
                    </div>
                  );
                })}
              </div>

              <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                Save Preferences
              </button>
            </div>
          )}

          {/* ═══ SESSIONS ═══ */}
          {activeSection === "sessions" && (
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Active Sessions
              </h2>
              <p className="text-[11px] text-gray-400 mb-6">
                These are devices that are currently logged into your
                account. Revoke any sessions you don&apos;t recognize.
              </p>

              <div className="space-y-3">
                {/* Current session */}
                <div className="flex items-center justify-between p-4 bg-emerald-50/80 dark:bg-emerald-900/15 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <HiOutlineComputerDesktop
                        size={20}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Current Session
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-white rounded-full font-bold">
                          ACTIVE
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Chrome on Windows •{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    This device
                  </span>
                </div>

                {/* Other session example */}
                <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <HiOutlineDevicePhoneMobile
                        size={20}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Mobile Device
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Safari on iOS • Last active 2 days ago
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] text-red-500 hover:text-red-600 font-bold transition-colors">
                    Revoke
                  </button>
                </div>
              </div>

              <button className="mt-5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-xl text-[11px] font-bold transition-all">
                Revoke All Other Sessions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
