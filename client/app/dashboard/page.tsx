"use client";

import React, { FC, useState } from "react";
import Protected from "@/app/hooks/useProtected";
import Heading from "@/app/utils/Heading";
import { useSelector } from "react-redux";
import DashboardSidebar from "@/app/components/Dashboard/DashboardSidebar";
import DashboardOverview from "@/app/components/Dashboard/DashboardOverview";
import DashboardCourses from "@/app/components/Dashboard/DashboardCourses";
import DashboardOrders from "@/app/components/Dashboard/DashboardOrders";
import DashboardSettings from "@/app/components/Dashboard/DashboardSettings";
import DashboardCertificates from "@/app/components/Dashboard/DashboardCertificates";
import Header from "@/app/components/Header";

const tabMeta: Record<string, { title: string; description: string }> = {
  overview: {
    title: "Overview",
    description:
      "Your personal learning dashboard — track progress, streaks, and performance.",
  },
  courses: {
    title: "My Courses",
    description: "Manage and continue your enrolled courses.",
  },
  orders: {
    title: "Order History",
    description: "View and manage your purchase transactions.",
  },
  certificates: {
    title: "Certificates",
    description: "Download and share your completion certificates.",
  },
  settings: {
    title: "Settings",
    description: "Manage your account, security, and preferences.",
  },
};

const DashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  const meta = tabMeta[activeTab] || tabMeta.overview;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview user={user} setActiveTab={setActiveTab} />;
      case "courses":
        return <DashboardCourses user={user} />;
      case "orders":
        return <DashboardOrders user={user} />;
      case "certificates":
        return <DashboardCertificates user={user} />;
      case "settings":
        return <DashboardSettings user={user} />;
      default:
        return <DashboardOverview user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Protected>
      <Heading
        title={`${meta.title} — ${user?.name || "Dashboard"} | ELearning`}
        description={meta.description}
        keywords="dashboard, learning, courses, progress, orders, certificates"
      />
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={-1}
      />

      <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-[#060B18] pt-[80px]">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <main
          className={`flex-1 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
            sidebarCollapsed ? "ml-0 lg:ml-[84px]" : "ml-0 lg:ml-[272px]"
          }`}
        >
          {/* Breadcrumb Bar */}
          <div className="sticky top-[80px] z-30 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-gray-500">
                  Dashboard
                </span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {meta.title}
                </span>
              </div>
              <p className="hidden md:block text-xs text-gray-400 dark:text-gray-500">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fadeInUp">
            {renderContent()}
          </div>
        </main>
      </div>
    </Protected>
  );
};

export default DashboardPage;
