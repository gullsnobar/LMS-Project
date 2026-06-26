"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import {
  AiOutlineCamera,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import avatarDefault from "../../../public/assetes/avatardefault.jpg";
import { useEffect, useState } from "react";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import toast from "react-hot-toast";

type ProfileInfoProps = {
  user: any;
  avatar: string | null;
};

const ProfileInfo = ({ user, avatar }: ProfileInfoProps) => {
  const [name, setName] = useState(user?.name || "");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [updateAvatar, { isSuccess: avatarSuccess, isLoading: avatarLoading }] =
    useUpdateAvatarMutation();
  const [editProfile, { isSuccess: editSuccess, isLoading: editLoading, error: editError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const { } = useLoadUserQuery(undefined, { skip: !loadUser });

  // Avatar upload handler
  const imageHandler = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreviewAvatar(reader.result as string);
        updateAvatar({ avatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (avatarSuccess) {
      setLoadUser(true);
      toast.success("Avatar updated successfully!");
    }
    if (editSuccess) {
      setLoadUser(true);
      toast.success("Profile updated successfully!");
    }
    if (editError && "data" in editError) {
      toast.error((editError as any).data?.message || "Update failed");
    }
  }, [avatarSuccess, editSuccess, editError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name.trim() !== "") {
      await editProfile({ name: name.trim(), email: user?.email });
    }
  };

  const avatarSrc =
    previewAvatar || user?.avatar?.url || avatar || avatarDefault;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="space-y-6">

      {/* ── Avatar Hero Card ─────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
        {/* gradient banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          {/* sparkle pattern */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar positioned over the banner */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-[#111827] shadow-xl shadow-blue-500/20">
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-2xl">
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-white"
                      size={24}
                    />
                  </div>
                )}
                <Image
                  src={avatarSrc}
                  alt="Profile Photo"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* Camera button */}
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-110 transition-transform">
                  <AiOutlineCamera size={16} className="text-white" />
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                onChange={imageHandler}
                accept="image/png,image/jpg,image/jpeg,image/webp"
              />
            </div>

            {/* Quick info badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40">
                  <HiOutlineCheckBadge size={13} />
                  Verified
                </span>
              )}
              {joinedDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold border border-gray-200 dark:border-gray-700">
                  <HiOutlineCalendarDays size={13} />
                  Joined {joinedDate}
                </span>
              )}
            </div>
          </div>

          {/* Name + email display */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
              <HiOutlineEnvelope size={14} />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Form Card ────────────────────── */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <HiOutlineUser size={15} className="text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Update your display name
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Full Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Full Name
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/40 dark:focus-within:ring-purple-500/40 focus-within:border-blue-500 dark:focus-within:border-purple-500">
              <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <HiOutlineUser size={16} />
              </span>
              <input
                type="text"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="flex-1 min-w-0 bg-transparent py-3 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Email Address
              <span className="ml-2 text-[10px] font-normal text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                Read only
              </span>
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/40 cursor-not-allowed">
              <span className="flex-shrink-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <HiOutlineEnvelope size={16} />
              </span>
              <input
                type="email"
                id="profile-email"
                readOnly
                value={user?.email || ""}
                className="flex-1 min-w-0 bg-transparent py-3 px-3 text-sm text-gray-500 dark:text-gray-400 focus:outline-none cursor-not-allowed select-none"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              Contact support to change your email address.
            </p>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800/30">
            <HiOutlineSparkles size={15} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
              Your display name appears on course certificates and your public learner profile.
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={editLoading || name.trim() === ""}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {editLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" size={15} />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => setName(user?.name || "")}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;