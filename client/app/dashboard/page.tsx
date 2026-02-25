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

const DashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview user={user} />;
      case "courses":
        return <DashboardCourses user={user} />;
      case "orders":
        return <DashboardOrders />;
      case "certificates":
        return <DashboardCertificates user={user} />;
      case "settings":
        return <DashboardSettings user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <Protected>
      <Heading
        title={`Dashboard | ${user?.name || "User"} - ELearning`}
        description="Your personal learning dashboard. Track your progress, manage courses, and view your order history."
        keywords="dashboard, learning, courses, progress, orders"
      />
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={-1}
      />
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 pt-[80px]">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-[80px]" : "ml-[80px] lg:ml-[280px]"
          }`}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </Protected>
  );
};

export default DashboardPage;
