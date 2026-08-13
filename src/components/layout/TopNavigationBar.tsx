import type React from "react";
import { useLocation } from "react-router";
import useSnackbarStore from "../../store/useSnackbarStore";
import useHeaderStore from "../../store/useHeaderStore";
import useNotification from "../../hooks/useNotification";
import NotificationDrawer from "../notifications/NotificationDrawer";

export interface TopNavigationBarProps {
  onNewOrderClick?: () => void;
}

interface PageHeaderConfig {
  searchPlaceholder: string;
  actionButtonText: string;
  actionButtonIcon: string;
}

const pageConfigs: Record<string, PageHeaderConfig> = {
  "/customers": {
    searchPlaceholder: "Search by name, phone or email...",
    actionButtonText: "Add New Customer",
    actionButtonIcon: "person_add",
  },
  "/orders": {
    searchPlaceholder: "Search orders by ID, status or customer...",
    actionButtonText: "Create Order",
    actionButtonIcon: "add_shopping_cart",
  },
  "/drivers": {
    searchPlaceholder: "Search drivers by name or phone...",
    actionButtonText: "Add Driver",
    actionButtonIcon: "person_add",
  },
  "/staff": {
    searchPlaceholder: "Search staff by name or role...",
    actionButtonText: "Add Staff Member",
    actionButtonIcon: "person_add",
  },
  "/services": {
    searchPlaceholder: "Search dry cleaning & laundry services...",
    actionButtonText: "Add Service",
    actionButtonIcon: "add_circle",
  },
  "/payments": {
    searchPlaceholder: "Search invoices or transaction ID...",
    actionButtonText: "New Transaction",
    actionButtonIcon: "payments",
  },
  "/promotions": {
    searchPlaceholder: "Search promo codes or campaigns...",
    actionButtonText: "Create Promo",
    actionButtonIcon: "local_offer",
  },
  "/reports": {
    searchPlaceholder: "Search reports & metrics...",
    actionButtonText: "Export Report",
    actionButtonIcon: "assessment",
  },
  "/settings": {
    searchPlaceholder: "Search system settings...",
    actionButtonText: "Save Settings",
    actionButtonIcon: "save",
  },
  default: {
    searchPlaceholder: "Search orders, customers, or drivers...",
    actionButtonText: "New Order",
    actionButtonIcon: "add",
  },
};

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  onNewOrderClick,
}) => {
  const location = useLocation();
  const { showSnackbar } = useSnackbarStore();
  const {
    searchQuery,
    setSearchQuery,
    customActionHandler,
    triggerCustomAction,
  } = useHeaderStore();

  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    socketConnected,
    toggleDrawer,
    setDrawerOpen,
    handleNotificationClick,
    markAllAsRead,
    clearNotifications,
  } = useNotification();

  // Dynamic header config based on current route
  const currentConfig = pageConfigs[location.pathname] || pageConfigs.default;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showSnackbar({
      message: `Searching ${currentConfig.actionButtonText.replace("Add ", "").replace("New ", "")} for "${searchQuery}"...`,
      type: "info",
    });
  };

  const handlePrimaryButtonClick = () => {
    if (customActionHandler) {
      triggerCustomAction();
    } else if (onNewOrderClick) {
      onNewOrderClick();
    } else {
      showSnackbar({
        message: `${currentConfig.actionButtonText} action triggered`,
        type: "success",
      });
    }
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-lg z-40 transition-all duration-200">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center flex-1 max-w-1/2"
      >
        <div className="relative w-full">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]"
            data-icon="search"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentConfig.searchPlaceholder}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md"
          />
        </div>
      </form>

      {/* Action Utility Buttons */}
      <div className="flex items-center gap-md">
        <button
          type="button"
          onClick={toggleDrawer}
          className="p-2 text-secondary hover:bg-secondary-container/50 rounded-full transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-primary text-on-primary rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-surface">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <NotificationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          socketConnected={socketConnected}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearNotifications}
        />

        <div className="h-8 w-px bg-outline-variant mx-2" />

        {/* Dynamic Route Primary Action Button */}
        <button
          type="button"
          onClick={handlePrimaryButtonClick}
          className="bg-primary text-on-primary px-lg py-2 rounded-default font-title-md text-sm flex items-center gap-sm hover:bg-primary-container transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon={currentConfig.actionButtonIcon}
          >
            {currentConfig.actionButtonIcon}
          </span>
          {currentConfig.actionButtonText}
        </button>
      </div>
    </header>
  );
};

export default TopNavigationBar;
