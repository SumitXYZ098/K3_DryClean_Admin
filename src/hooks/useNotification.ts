import { useEffect } from "react";
import { useNavigate } from "react-router";
import useNotificationStore, {
  type NotificationState,
} from "../store/useNotificationStore";
import type { NotificationItem } from "../api/notificationApi";

export const useNotification = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    isDrawerOpen,
    socketConnected,
    fetchNotifications,
    addNotification,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    setDrawerOpen,
    toggleDrawer,
    initSocket,
    disconnectSocket,
  } = useNotificationStore() as NotificationState;

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();

    // Initialize socket listener for real-time notification events
    initSocket();

    return () => {
      // Optional cleanup on unmount
    };
  }, [fetchNotifications, initSocket]);

  /**
   * Handle clicking on a notification item:
   * - Mark notification as read
   * - Close drawer
   * - Navigate based on type: "order" -> /orders, "user" -> /customers
   */
  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id || item.documentId);
    setDrawerOpen(false);

    const type = item.type ? item.type.toLowerCase() : "";

    if (type === "order") {
      navigate("/orders");
    } else if (type === "user" || type === "customer") {
      navigate("/customers");
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    isDrawerOpen,
    socketConnected,
    fetchNotifications,
    addNotification,
    markAllAsRead,
    clearNotifications,
    setDrawerOpen,
    toggleDrawer,
    handleNotificationClick,
    disconnectSocket,
  };
};

export default useNotification;
