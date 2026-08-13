import type React from "react";
import Drawer from "@mui/material/Drawer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NotificationItem } from "../../api/notificationApi";
import { getSocket } from "../../services/socketService";

dayjs.extend(relativeTime);

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  socketConnected: boolean;
  onNotificationClick: (item: NotificationItem) => void;
  onMarkAllAsRead: () => void;
  onClearAll?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  socketConnected,
  onNotificationClick,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const isLive = socketConnected || !!getSocket()?.connected;

  // Format creation time using dayjs
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const parsed = dayjs(dateString);
    if (!parsed.isValid()) return dateString;
    const diffHours = dayjs().diff(parsed, "hour");
    if (diffHours < 24) return parsed.fromNow();
    return parsed.format("MMM D, YYYY h:mm A");
  };

  // Get icon based on type
  const getTypeConfig = (typeStr: string) => {
    const type = (typeStr || "").toLowerCase();
    if (type === "order") {
      return {
        icon: "shopping_bag",
        bgColor: "bg-blue-100 text-blue-700",
        tagColor: "bg-blue-50 text-blue-800 border-blue-200",
        label: "Order",
      };
    }
    if (type === "user" || type === "customer") {
      return {
        icon: "person_add",
        bgColor: "bg-green-100 text-green-700",
        tagColor: "bg-green-50 text-green-800 border-green-200",
        label: "User",
      };
    }
    return {
      icon: "notifications",
      bgColor: "bg-purple-100 text-purple-700",
      tagColor: "bg-purple-50 text-purple-800 border-purple-200",
      label: typeStr ? typeStr.toUpperCase() : "SYSTEM",
    };
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            borderBottomLeftRadius: "20px",
            borderTopLeftRadius: "20px",
            width: "420px",
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      <div className="flex flex-col h-full bg-surface text-on-surface">
        {/* Drawer Header */}
        <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest sticky top-0 z-10">
          <div className="flex items-center gap-sm">
            <div className="relative">
              <span className="material-symbols-outlined text-2xl text-primary">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline-md text-lg text-on-surface font-bold">
                Notifications
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-xs text-secondary font-medium">
                  {isLive ? "Real-time active" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-xs">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs text-primary font-bold hover:underline px-2 py-1 rounded hover:bg-primary-container/10 cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Notifications List Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/60 p-md space-y-sm">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-xl space-y-sm">
              <span className="material-symbols-outlined text-5xl text-outline">
                notifications_off
              </span>
              <p className="font-title-md text-on-surface font-bold">
                No notifications yet
              </p>
              <p className="text-body-md text-secondary">
                You're all caught up! Real-time alerts for orders and users will
                appear here.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const typeCfg = getTypeConfig(item.type);
              const isUnread = !item.read;

              return (
                <div
                  key={item.id || item.documentId}
                  onClick={() => onNotificationClick(item)}
                  className={`group p-md rounded-xl border transition-all cursor-pointer relative ${
                    isUnread
                      ? "bg-primary-container/10 border-primary/30 shadow-xs hover:border-primary"
                      : "bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container-low hover:border-outline-variant"
                  }`}
                >
                  <div className="flex items-start gap-md">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeCfg.bgColor}`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {typeCfg.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-xs mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${typeCfg.tagColor}`}
                        >
                          {typeCfg.label}
                        </span>
                        <span className="text-[11px] text-secondary">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>

                      <h4 className="font-title-md text-sm text-on-surface font-bold group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-body-md text-on-surface-variant text-xs mt-1 line-clamp-2 leading-normal">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View details</span>
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_forward
                        </span>
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {isUnread && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {notifications.length > 0 && (
          <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
            <span className="text-xs text-secondary">
              Total {notifications.length} notification
              {notifications.length > 1 ? "s" : ""}
            </span>
            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-error font-bold hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default NotificationDrawer;
