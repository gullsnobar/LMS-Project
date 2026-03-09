"use client";

import React, { FC, useState, useEffect } from "react";
import {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
} from "../../../../redux/features/coupons/couponApi";
import toast from "react-hot-toast";
import {
  HiOutlineTicket,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";

type Props = {};

const ManageCoupons: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetAllCouponsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    maxUses: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiresAt: "",
  });

  const coupons = data?.coupons || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discountValue || !formData.expiresAt) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res: any = await createCoupon({
        code: formData.code,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxUses: formData.maxUses ? Number(formData.maxUses) : 0,
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        expiresAt: formData.expiresAt,
      });

      if (res?.data?.success) {
        toast.success("Coupon created successfully!");
        setShowForm(false);
        setFormData({
          code: "",
          discountType: "percentage",
          discountValue: "",
          maxUses: "",
          minOrderAmount: "",
          maxDiscount: "",
          expiresAt: "",
        });
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Failed to create coupon");
      }
    } catch {
      toast.error("Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res: any = await deleteCoupon(id);
      if (res?.data?.success) {
        toast.success("Coupon deleted");
        refetch();
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl w-48" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800/60 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Coupon Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm"
        >
          {showForm ? <HiOutlineXMark size={18} /> : <HiOutlinePlus size={18} />}
          {showForm ? "Cancel" : "Create Coupon"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            New Coupon
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 15.00"}
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
                step="0.01"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expires At *
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Uses (0 = unlimited)
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Min Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Order Amount ($)
              </label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Max Discount (for percentage type) */}
            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Discount Cap ($)
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="No cap"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm"
          >
            {creating ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <HiOutlineTicket className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            No coupons created yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon: any) => (
            <div
              key={coupon._id}
              className={`p-4 bg-white dark:bg-gray-900 rounded-2xl border ${
                isExpired(coupon.expiresAt)
                  ? "border-red-200 dark:border-red-900/50 opacity-60"
                  : "border-gray-200 dark:border-gray-800"
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isExpired(coupon.expiresAt)
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
                    <HiOutlineTag
                      className={
                        isExpired(coupon.expiresAt)
                          ? "text-red-600 dark:text-red-400"
                          : "text-blue-600 dark:text-blue-400"
                      }
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                        {coupon.code}
                      </span>
                      {isExpired(coupon.expiresAt) && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md">
                          EXPIRED
                        </span>
                      )}
                      {!coupon.isActive && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <HiOutlineCurrencyDollar size={14} />
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% off`
                          : `$${coupon.discountValue} off`}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendarDays size={14} />
                        Expires{" "}
                        {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        Used: {coupon.usedCount}
                        {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " (unlimited)"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(coupon._id)}
                  disabled={deleting}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete coupon"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
