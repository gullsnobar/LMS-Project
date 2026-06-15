"use client";

import React, { FC, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineArrowDownTray,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineReceiptPercent,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { useGetUserOrdersQuery } from "../../../redux/features/dashboard/dashboardApi";

type Props = { user: any };

const DashboardOrders: FC<Props> = ({ user }) => {
  const { data, isLoading } = useGetUserOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const orders: any[] = data?.orders || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((o) =>
        (o.course?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const totalSpent = useMemo(
    () =>
      orders.reduce(
        (sum: number, o: any) => sum + (o.amount || o.course?.price || 0),
        0
      ),
    [orders]
  );

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fmtTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* loading skeleton */
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800/60 rounded-xl w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-800/60 rounded-2xl"
            />
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-800/60 rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Order History
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {orders.length} transaction{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* ── Summary Cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: (
              <HiOutlineClipboardDocumentList
                size={20}
                className="text-white"
              />
            ),
            label: "Total Orders",
            value: orders.length,
            gradient: "from-blue-500 to-blue-700",
            glow: "shadow-blue-500/25",
          },
          {
            icon: <HiOutlineCheckCircle size={20} className="text-white" />,
            label: "Successful",
            value: orders.length,
            gradient: "from-emerald-500 to-green-700",
            glow: "shadow-emerald-500/25",
          },
          {
            icon: (
              <HiOutlineCurrencyDollar size={20} className="text-white" />
            ),
            label: "Total Spent",
            value: `$${totalSpent.toFixed(2)}`,
            gradient: "from-violet-500 to-purple-700",
            glow: "shadow-violet-500/25",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity rounded-full blur-xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.glow}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                  {card.label}
                </p>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ───────────────────────────────── */}
      {orders.length > 0 && (
        <div className="relative max-w-sm">
          <HiOutlineMagnifyingGlass
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search orders…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* ── Orders Table ─────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/80 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800/60">
            {[
              { span: 5, label: "Course" },
              { span: 2, label: "Date" },
              { span: 2, label: "Amount" },
              { span: 2, label: "Payment" },
              { span: 1, label: "Status" },
            ].map((col) => (
              <div
                key={col.label}
                className={`col-span-${col.span} text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500`}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {filtered.map((order: any, i: number) => {
              const isExpanded = expandedId === (order._id || i);
              return (
                <div key={order._id || i}>
                  {/* Main Row */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-800/20 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : order._id || String(i))
                    }
                  >
                    {/* Course */}
                    <div className="md:col-span-5 flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {order.course?.thumbnail?.url ? (
                          <Image
                            src={order.course.thumbnail.url}
                            alt={order.course.name}
                            width={48}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
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
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {order.course?.name || "Course"}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate font-mono">
                          #{order._id?.slice(-8) || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2 flex items-center">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {order.createdAt ? fmt(order.createdAt) : "N/A"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {order.createdAt ? fmtTime(order.createdAt) : ""}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-2 flex items-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${(order.amount ?? order.course?.price ?? 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Payment */}
                    <div className="md:col-span-2 flex items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-5 bg-gradient-to-r from-[#635bff] to-[#7b73ff] rounded flex items-center justify-center">
                          <span className="text-[7px] text-white font-extrabold tracking-wider">
                            STRIPE
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          ••••{" "}
                          {order.payment_info?.payment_method_types?.[0] ||
                            "card"}
                        </span>
                      </div>
                    </div>

                    {/* Status + Expand */}
                    <div className="md:col-span-1 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Paid
                      </span>
                      <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        {isExpanded ? (
                          <HiOutlineChevronUp size={16} />
                        ) : (
                          <HiOutlineChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Expanded Detail Panel ─── */}
                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fadeInUp">
                      <div className="p-5 bg-gray-50/80 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-800/60 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Course image */}
                          <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {order.course?.thumbnail?.url ? (
                              <Image
                                src={order.course.thumbnail.url}
                                alt={order.course.name}
                                width={96}
                                height={80}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                                <HiOutlineCreditCard size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {order.course?.name || "Course"}
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                                  Order ID
                                </p>
                                <p className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                                  #{order._id?.slice(-12) || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                                  Date
                                </p>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {order.createdAt ? fmt(order.createdAt) : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                                  Amount
                                </p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                  ${(order.amount ?? order.course?.price ?? 0).toFixed(2)} USD
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                                  Level
                                </p>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {order.course?.level || "Beginner"}
                                </p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Link
                                href={`/course-access/${order.courseId}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-[11px] font-bold hover:shadow-lg transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <HiOutlineCalendarDays size={13} />
                                Access Course
                              </Link>
                              <button
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <HiOutlineArrowDownTray size={13} />
                                Receipt
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Security footer */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                          <HiOutlineShieldCheck
                            size={14}
                            className="text-emerald-500"
                          />
                          <p className="text-[10px] text-gray-400">
                            Payment secured by Stripe. Transaction verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : orders.length > 0 && filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <HiOutlineMagnifyingGlass
            size={40}
            className="mx-auto text-gray-300 dark:text-gray-700 mb-3"
          />
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
            No matching orders
          </h3>
          <p className="text-sm text-gray-400">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-gray-800/80">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <HiOutlineReceiptPercent
              size={32}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            No Orders Yet
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mb-5">
            Your purchase history will appear here once you buy a course.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
