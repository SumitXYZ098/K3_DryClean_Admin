import type React from "react";
import { Link, useLocation } from "react-router";
import Logo from "../common/Logo";
import useAuthStore from "../../store/useAuthStore";
import useAuthHook from "../../hooks/useAuthHook";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Orders", path: "/orders", icon: "receipt_long" },
  { label: "Customers", path: "/customers", icon: "group" },
  { label: "Drivers", path: "/drivers", icon: "local_shipping" },
  { label: "Staff", path: "/staff", icon: "badge" },
  { label: "Services", path: "/services", icon: "dry_cleaning" },
  { label: "Payments", path: "/payments", icon: "payments" },
  { label: "Promotions", path: "/promotions", icon: "sell" },
  { label: "Reports", path: "/reports", icon: "assessment" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

export const SideNavigationBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuthHook();

  const userName = user?.name || user?.username || "Alex Mercer";
  const userRole = user?.role?.name || "Chief Administrator";
  const avatarUrl =
    user?.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";

  return (
    <aside className="fixed left-0 top-0 h-full w-70 bg-surface border-r border-outline-variant shadow-sm flex flex-col py-lg px-md z-50">
      {/* Brand Header */}
      <div className="mb-xl px-xs flex flex-col items-start gap-1">
        <Logo size="sm" />
        <p className="text-secondary text-label-sm tracking-wider uppercase opacity-70 mt-1 font-semibold">
          Admin Console
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-primary font-bold bg-primary-container/10 border-l-4 border-primary"
                  : "text-secondary hover:bg-secondary-container/50 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Bottom Container */}
      <div className="mt-auto pt-lg border-t border-outline-variant flex items-center justify-between px-xs">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden border border-outline-variant">
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-32.5 truncate">
            <p className="font-title-md text-sm text-on-surface truncate">
              {userName}
            </p>
            <p className="text-label-sm text-secondary truncate">{userRole}</p>
          </div>
        </div>

        {/* Logout Action Button */}
        <button
          onClick={logout}
          title="Sign out"
          className="p-2 text-secondary hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavigationBar;
