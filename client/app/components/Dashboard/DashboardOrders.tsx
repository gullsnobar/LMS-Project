"use client";

import React, { FC } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { useGetUserOrdersQuery } from "../../../redux/features/dashboard/dashboardApi";

const DashboardOrders: FC = () => {
  const { data, isLoading } = useGetUserOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const orders = data?.orders || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order History
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {orders.length} transaction{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <HiOutlineClipboardDocumentList size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {orders.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <HiOutlineCheckCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Successful
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {orders.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <HiOutlineCreditCard size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Spent
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                $
                {orders.reduce(
                  (sum: number, order: any) =>
                    sum + (order.course?.price || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <div className="col-span-5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Course
            </div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Date
            </div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Amount
            </div>
            <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Payment
            </div>
            <div className="col-span-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order: any, index: number) => (
              <div
                key={order._id || index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Course Info */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {order.course?.thumbnail?.url ? (
                      <img
                        src={order.course.thumbnail.url}
                        alt={order.course.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiOutlineCreditCard
                          size={16}
                          className="text-gray-400"
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {order.course?.name || "Course"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      ID: {order._id?.slice(-8) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="md:col-span-2 flex items-center">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.createdAt ? formatTime(order.createdAt) : ""}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="md:col-span-2 flex items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${order.course?.price || 0}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="md:col-span-2 flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">
                        STRIPE
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      •••• {order.payment_info?.payment_method_types?.[0] || "card"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-1 flex items-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <HiOutlineCreditCard
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Orders Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your purchase history will appear here once you buy a course.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
