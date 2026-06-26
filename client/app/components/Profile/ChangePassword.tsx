"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import toast from "react-hot-toast";

/* ─── shared input system (flex-based, no absolute icons) ─── */
// Container: owns the border, background, and focus ring
const fieldWrapCls =
  "flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/40 dark:focus-within:ring-purple-500/40 focus-within:border-blue-500 dark:focus-within:border-purple-500";

// Icon span: left-side icon, always vertically centred by flexbox
const iconSpanCls = "flex-shrink-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500";

// Input: transparent, fills remaining space
const innerInputCls =
  "flex-1 min-w-0 bg-transparent py-3 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none";

// Eye toggle button: right side
const eyeBtnCls =
  "flex-shrink-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors";

const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [updatePassword, { isSuccess, isLoading, error }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password updated successfully!");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    if (error && "data" in error) {
      toast.error((error as any).data?.message || "Password update failed");
    }
  }, [isSuccess, error]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    await updatePassword({ oldPassword, newPassword });
  };

  /* strength */
  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(newPassword);
  const barColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"][strength];
  const textColor = ["", "text-red-500", "text-yellow-600", "text-blue-500 dark:text-blue-400", "text-emerald-600 dark:text-emerald-400"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const passwordMatch   = confirmPassword !== "" && newPassword === confirmPassword;
  const passwordMismatch = confirmPassword !== "" && newPassword !== confirmPassword;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm overflow-hidden">

        {/* header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <HiOutlineShieldCheck size={15} className="text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Change Password</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label htmlFor="old-password" className={labelCls}>Current Password</label>
            <div className={fieldWrapCls}>
              <span className={iconSpanCls}>
                <HiOutlineLockClosed size={16} />
              </span>
              <input
                id="old-password"
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className={innerInputCls}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className={eyeBtnCls}
                tabIndex={-1}
              >
                {showOld ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
              </button>
            </div>
          </div>

          {/* divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-[#111827] text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                New Password
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className={labelCls}>New Password</label>
            <div className={fieldWrapCls}>
              <span className={iconSpanCls}>
                <HiOutlineLockClosed size={16} />
              </span>
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a strong new password"
                required
                className={innerInputCls}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className={eyeBtnCls}
                tabIndex={-1}
              >
                {showNew ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              Minimum 8 characters with uppercase, numbers &amp; symbols.
            </p>

            {/* Strength bar */}
            {newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">Password strength</span>
                  <span className={`text-[11px] font-bold ${textColor}`}>{strengthLabel}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? barColor : "bg-gray-100 dark:bg-gray-800"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className={labelCls}>Confirm New Password</label>
            <div className={fieldWrapCls}>
              <span className={iconSpanCls}>
                <HiOutlineLockClosed size={16} />
              </span>
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                className={innerInputCls}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={eyeBtnCls}
                tabIndex={-1}
              >
                {showConfirm ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
              </button>
            </div>
            {confirmPassword && (
              <div className={`flex items-center gap-1.5 mt-2 text-[11px] font-semibold ${passwordMatch ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                {passwordMatch
                  ? <><HiOutlineCheckCircle size={13} /> Passwords match</>
                  : <><HiOutlineExclamationTriangle size={13} /> Passwords do not match</>}
              </div>
            )}
          </div>

          {/* Security tips */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <HiOutlineShieldCheck size={13} /> Security Tips
            </p>
            <ul className="space-y-1">
              {["Use at least 8 characters", "Mix uppercase, numbers & symbols", "Avoid using personal information", "Don't reuse passwords from other sites"].map((tip) => (
                <li key={tip} className="text-[10px] text-amber-600 dark:text-amber-500 flex items-start gap-1.5">
                  <span className="mt-[3px] w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isLoading || passwordMismatch || !oldPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading
                ? <><AiOutlineLoading3Quarters className="animate-spin" size={15} /> Updating…</>
                : <><HiOutlineLockClosed size={15} /> Update Password</>}
            </button>
            <button
              type="button"
              onClick={() => { setOldPassword(""); setNewPassword(""); setConfirmPassword(""); }}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;