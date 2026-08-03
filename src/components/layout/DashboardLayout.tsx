import type React from "react";
import { Outlet } from "react-router";
import SideNavigationBar from "./SideNavigationBar";
import TopNavigationBar from "./TopNavigationBar";

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md overflow-hidden">
      {/* Side Navigation Bar */}
      <SideNavigationBar />

      {/* Top Header Bar */}
      <TopNavigationBar />

      {/* Main Content Area */}
      <main className="ml-70 mt-16 p-lg h-[calc(100vh-64px)] overflow-y-auto bg-surface-bright">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
